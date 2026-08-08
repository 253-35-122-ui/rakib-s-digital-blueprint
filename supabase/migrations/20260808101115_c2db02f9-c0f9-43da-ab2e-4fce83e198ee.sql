
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- first signup becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILE
CREATE TABLE public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  university text NOT NULL DEFAULT '',
  semester text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '',
  standup_text text NOT NULL DEFAULT '',
  content_page_name text NOT NULL DEFAULT '',
  content_page_url text NOT NULL DEFAULT '',
  content_page_desc text NOT NULL DEFAULT '',
  photo_url text,
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profile TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile TO authenticated;
GRANT ALL ON public.profile TO service_role;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profile public read" ON public.profile FOR SELECT USING (true);
CREATE POLICY "profile admin write" ON public.profile FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER profile_updated BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ACADEMIC
CREATE TABLE public.academic_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  institution text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academic_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_entries TO authenticated;
GRANT ALL ON public.academic_entries TO service_role;
ALTER TABLE public.academic_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "academic public read" ON public.academic_entries FOR SELECT USING (true);
CREATE POLICY "academic admin write" ON public.academic_entries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SKILLS
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Technical',
  display_order int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills public read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "skills admin write" ON public.skills FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  display_order int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements public read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "achievements admin write" ON public.achievements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- COMPETITIONS
CREATE TABLE public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  detail text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.competitions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.competitions TO authenticated;
GRANT ALL ON public.competitions TO service_role;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "competitions public read" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "competitions admin write" ON public.competitions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- GALLERY
CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "gallery admin write" ON public.gallery_photos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SEED
INSERT INTO public.profile (name, tagline, department, university, semester, bio, about, standup_text, content_page_name, content_page_url, content_page_desc, phone, whatsapp, email, facebook, instagram)
VALUES (
 'MD Abu Hasnat Rakib',
 'Civil Engineering Student & Creative Enthusiast',
 'Civil Engineering',
 'Daffodil International University',
 'Level 2, Term 1',
 'Civil Engineering student with a passion for structural and truss work, public speaking, stand-up comedy, content creation, video editing and script writing.',
 'I am a Civil Engineering student at Daffodil International University who enjoys combining engineering precision with creativity. From designing and building trusses for national competitions to performing stand-up comedy on stage, leading teams and organizing big events, I like to keep both sides of my brain busy.',
 'Beyond calculations and drawings, the stage is where I feel at home. Stand-up comedy, public speaking and event organizing taught me timing, confidence and how to connect with a crowd.',
 'Hasu Vai',
 'https://www.facebook.com/share/14kgxx5Jugs/?mibextid=wwXIfr',
 'A Facebook content page featuring funny content, comedy and informative content.',
 '01605554718','01936953097','hasnat.mng@gmail.com',
 'https://www.facebook.com/share/199UvQFTY9/?mibextid=wwXIfr',
 'https://www.instagram.com/akhasnat?igsh=MWlpZzZvbWZhcjFvZg=='
);

INSERT INTO public.academic_entries (title, institution, detail, display_order) VALUES
 ('University','Daffodil International University','Department of Civil Engineering — Level 2, Term 1',1),
 ('HSC','Nirjhor Cantonment Public School & College','Higher Secondary Certificate',2),
 ('SSC','A.Q.M. Secondary High School, Barishal','Secondary School Certificate',3);

INSERT INTO public.skills (name, category, display_order) VALUES
 ('AutoCAD','Technical',1),
 ('Presentation','Technical',2),
 ('Deadline Management','Technical',3),
 ('Public Speaking','Soft Skill',4),
 ('Big Event Organizing','Soft Skill',5),
 ('Leadership','Soft Skill',6),
 ('Stand-Up Comedy','Creative',7),
 ('Video Editing','Creative',8),
 ('Script Writing','Creative',9),
 ('Truss Making','Creative',10);

INSERT INTO public.achievements (title, description, display_order) VALUES
 ('Champion in Stand-Up Comedy — UIU','Won first place in the stand-up comedy competition hosted at United International University.',1);

INSERT INTO public.competitions (name, detail, display_order) VALUES
 ('IUT','Truss competition participant',1),
 ('IIUC','Truss competition participant',2),
 ('DUET','Truss competition participant',3),
 ('MIST','Truss competition participant',4),
 ('BUET','Truss competition participant',5);
