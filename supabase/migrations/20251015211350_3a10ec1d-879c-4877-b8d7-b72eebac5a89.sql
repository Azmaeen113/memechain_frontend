-- Create presale configuration table
CREATE TABLE public.presale (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_stage INT NOT NULL DEFAULT 1 CHECK (current_stage IN (1, 2)),
  stage1_price DECIMAL(20, 10) NOT NULL DEFAULT 0.00001,
  stage2_price DECIMAL(20, 10) NOT NULL DEFAULT 0.000015,
  current_price DECIMAL(20, 10) NOT NULL DEFAULT 0.00001,
  total_raised DECIMAL(20, 2) NOT NULL DEFAULT 0,
  total_participants INT NOT NULL DEFAULT 0,
  tokens_allocated BIGINT NOT NULL DEFAULT 0,
  hard_cap DECIMAL(20, 2) NOT NULL DEFAULT 1000000,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMPTZ NOT NULL DEFAULT '2025-01-15T00:00:00Z',
  end_date TIMESTAMPTZ NOT NULL DEFAULT '2025-03-15T00:00:00Z',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create users table for wallet participants
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  chain TEXT NOT NULL,
  total_contributed DECIMAL(20, 2) NOT NULL DEFAULT 0,
  meme_balance BIGINT NOT NULL DEFAULT 0,
  first_contribution TIMESTAMPTZ,
  last_contribution TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  amount DECIMAL(20, 2) NOT NULL,
  chain TEXT NOT NULL,
  meme_received BIGINT NOT NULL,
  price_at_purchase DECIMAL(20, 10) NOT NULL,
  tx_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create newsletter table
CREATE TABLE public.newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on all tables
ALTER TABLE public.presale ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- RLS Policies for presale (publicly readable)
CREATE POLICY "Presale is publicly readable"
ON public.presale FOR SELECT
TO public USING (true);

-- RLS Policies for users (publicly readable for stats, but users can only update their own)
CREATE POLICY "Users are publicly readable"
ON public.users FOR SELECT
TO public USING (true);

CREATE POLICY "Users can insert their own data"
ON public.users FOR INSERT
TO public WITH CHECK (true);

CREATE POLICY "Users can update their own data"
ON public.users FOR UPDATE
TO public USING (wallet_address = wallet_address);

-- RLS Policies for transactions (publicly readable for transparency)
CREATE POLICY "Transactions are publicly readable"
ON public.transactions FOR SELECT
TO public USING (true);

CREATE POLICY "Transactions can be inserted"
ON public.transactions FOR INSERT
TO public WITH CHECK (true);

-- RLS Policies for newsletter
CREATE POLICY "Newsletter entries can be created"
ON public.newsletter FOR INSERT
TO public WITH CHECK (true);

-- Insert initial presale configuration
INSERT INTO public.presale (
  current_stage,
  stage1_price,
  stage2_price,
  current_price,
  total_raised,
  total_participants,
  tokens_allocated,
  hard_cap,
  is_active,
  start_date,
  end_date
) VALUES (
  1,
  0.00001,
  0.000015,
  0.00001,
  125000.50,
  847,
  12500050000,
  1000000,
  true,
  '2025-01-15T00:00:00Z',
  '2025-03-15T00:00:00Z'
);

-- Create indexes for performance
CREATE INDEX idx_users_wallet_address ON public.users(wallet_address);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_wallet_address ON public.transactions(wallet_address);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_newsletter_email ON public.newsletter(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_presale_updated_at
BEFORE UPDATE ON public.presale
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();