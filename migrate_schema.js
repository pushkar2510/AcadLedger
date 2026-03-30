const fs = require('fs');
let content = fs.readFileSync('schema_clean.sql', 'utf8');

// Replace all instances
content = content.replace(/institute/g, 'recruiter')
                 .replace(/Institute/g, 'Recruiter')
                 .replace(/INSTITUTE/g, 'RECRUITER');

// Add the opportunities table
const oppTableSQL = `
CREATE TABLE public.opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recruiter_id uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    required_skills jsonb DEFAULT '[]'::jsonb NOT NULL,
    associated_test_id uuid,
    stipend text,
    duration text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    status public.test_status DEFAULT 'draft'::public.test_status NOT NULL,
    CONSTRAINT opp_pkey PRIMARY KEY (id),
    CONSTRAINT fk_recruiter
      FOREIGN KEY(recruiter_id) 
      REFERENCES public.recruiter_profiles(profile_id)
      ON DELETE CASCADE
);

CREATE POLICY "Opportunities are readable by everyone" ON public.opportunities
    FOR SELECT
    USING (status = 'published');

CREATE POLICY "Recruiters can modify own opportunities" ON public.opportunities
    FOR ALL
    USING (auth.uid() = recruiter_id);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
`;

content += '\n\n' + oppTableSQL;

fs.writeFileSync('schema_recruiter.sql', content);
console.log('Created schema_recruiter.sql!');
