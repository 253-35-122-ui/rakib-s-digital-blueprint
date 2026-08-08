import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2, ArrowUp, ArrowDown, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db, errMessage } from "@/lib/db";
import { fileToDataUrl } from "@/lib/image";
import { validateValues } from "@/lib/validate";

export type FieldType = "text" | "textarea" | "image" | "switch";

export type FieldDef = {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
};

type Row = Record<string, unknown> & { id: string; display_order?: number };

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="h-20 w-20 rounded-md border border-border object-cover"
          />
        ) : null}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent/10">
          <ImagePlus className="h-4 w-4" />
          {busy ? "Processing…" : value ? "Replace image" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                onChange(await fileToDataUrl(file));
              } catch (err) {
                toast.error(errMessage(err));
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
        {value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function CrudSection({
  table,
  title,
  description,
  fields,
  defaults,
}: {
  table: string;
  title: string;
  description: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [draftErrors, setDraftErrors] = useState<Record<string, string>>({});

  const { data: rows = [] } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await db.from(table).select("*").order("display_order", {
        ascending: true,
      });
      if (error) throw new Error(errMessage(error));
      return (data ?? []) as Row[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: [table] });

  const create = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await db.from(table).insert(values);
      if (error) throw new Error(errMessage(error));
    },
    onSuccess: () => {
      toast.success("Added");
      setDraft(null);
      setDraftErrors({});
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await db.from(table).update(values).eq("id", id);
      if (error) throw new Error(errMessage(error));
    },
    onSuccess: () => {
      toast.success("Saved");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw new Error(errMessage(error));
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function move(index: number, dir: -1 | 1) {
    const a = rows[index];
    const b = rows[index + dir];
    if (!a || !b) return;
    update.mutate({ id: a.id, values: { display_order: b.display_order ?? index + 1 + dir } });
    update.mutate({ id: b.id, values: { display_order: a.display_order ?? index + 1 } });
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          onClick={() =>
            setDraft({ ...defaults, display_order: (rows[rows.length - 1]?.display_order ?? 0) + 1 })
          }
        >
          <Plus className="h-4 w-4" /> Add new
        </Button>
      </div>

      {draft ? (
        <div className="card-surface mb-6 space-y-4 border-accent/50 p-5">
          <h3 className="font-semibold">New entry</h3>
          <RowFields fields={fields} values={draft} onChange={setDraft} errors={draftErrors} />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const errs = validateValues(draft, fields.map((f) => f.key));
                setDraftErrors(errs);
                if (Object.keys(errs).length > 0) {
                  toast.error("Please fix the highlighted fields.");
                  return;
                }
                create.mutate(draft);
              }}
              disabled={create.isPending}
            >
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {rows.map((row, i) => (
          <RowEditor
            key={row.id}
            row={row}
            fields={fields}
            index={i}
            total={rows.length}
            onMove={move}
            onSave={(values) => update.mutate({ id: row.id, values })}
            onDelete={() => remove.mutate(row.id)}
          />
        ))}
        {rows.length === 0 && !draft ? (
          <p className="text-sm text-muted-foreground">Nothing here yet. Use “Add new”.</p>
        ) : null}
      </div>
    </section>
  );
}

function RowFields({
  fields,
  values,
  onChange,
  errors = {},
}: {
  fields: FieldDef[];
  values: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
  errors?: Record<string, string>;
}) {
  const set = (k: string, v: unknown) => onChange({ ...values, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const val = values[f.key];
        if (f.type === "image") {
          return (
            <div key={f.key} className="sm:col-span-2">
              <ImageField
                label={f.label}
                value={(val as string) ?? null}
                onChange={(v) => set(f.key, v)}
              />
            </div>
          );
        }
        if (f.type === "switch") {
          return (
            <div key={f.key} className="flex items-center gap-3 pt-6">
              <Switch checked={Boolean(val)} onCheckedChange={(c) => set(f.key, c)} id={f.key} />
              <Label htmlFor={f.key}>{f.label}</Label>
            </div>
          );
        }
        if (f.type === "textarea") {
          return (
            <div key={f.key} className="space-y-2 sm:col-span-2">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Textarea
                id={f.key}
                rows={4}
                value={(val as string) ?? ""}
                placeholder={f.placeholder}
                aria-invalid={Boolean(errors[f.key])}
                onChange={(e) => set(f.key, e.target.value)}
              />
              {errors[f.key] ? (
                <p className="text-sm text-destructive">{errors[f.key]}</p>
              ) : null}
            </div>
          );
        }
        return (
          <div key={f.key} className="space-y-2">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              value={(val as string) ?? ""}
              placeholder={f.placeholder}
              aria-invalid={Boolean(errors[f.key])}
              onChange={(e) => set(f.key, e.target.value)}
            />
            {errors[f.key] ? <p className="text-sm text-destructive">{errors[f.key]}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

function RowEditor({
  row,
  fields,
  index,
  total,
  onMove,
  onSave,
  onDelete,
}: {
  row: Row;
  fields: FieldDef[];
  index: number;
  total: number;
  onMove: (index: number, dir: -1 | 1) => void;
  onSave: (values: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(row);
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <div className="card-surface space-y-4 p-5">
      <RowFields fields={fields} values={values} onChange={setValues} errors={errors} />
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={`order-${row.id}`} className="text-xs text-muted-foreground">
            Display order
          </Label>
          <Input
            id={`order-${row.id}`}
            type="number"
            className="w-20"
            value={String(values["display_order"] ?? "")}
            onChange={(e) => setValues({ ...values, display_order: Number(e.target.value) })}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Move up"
          disabled={index === 0}
          onClick={() => onMove(index, -1)}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Move down"
          disabled={index === total - 1}
          onClick={() => onMove(index, 1)}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => {
            const errs = validateValues(values, fields.map((f) => f.key));
            setErrors(errs);
            if (Object.keys(errs).length > 0) {
              toast.error("Please fix the highlighted fields.");
              return;
            }
            onSave(values);
          }}
        >
          <Save className="h-4 w-4" /> Save
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
