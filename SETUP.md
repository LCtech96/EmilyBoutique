# Setup Instructions - Emily Boutique

## 1. Installazione Dipendenze

```bash
pnpm install
```

## 2. Configurazione Database Supabase

### Step 1: Crea le Tabelle

Vai al SQL Editor in Supabase Dashboard ed esegui il contenuto di `lib/database.sql`:

```sql
-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero image
CREATE TABLE IF NOT EXISTS hero_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsor images
CREATE TABLE IF NOT EXISTS sponsor_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id TEXT,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_size TEXT,
  selected_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_method TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO admin_users (email, password_hash) 
VALUES ('emilyboutique@arubapec.it', '123Emily!')
ON CONFLICT (email) DO NOTHING;
```

### Step 2: Crea Storage Bucket

1. Vai a **Storage** nel menu laterale di Supabase
2. Clicca su **New bucket**
3. Nome: `images`
4. Imposta come **Public bucket**
5. Clicca **Create bucket**

### Step 3: Configura RLS (Row Level Security)

Per le tabelle pubbliche (products, hero_image, sponsor_images), puoi disabilitare RLS o creare policy appropriate:

```sql
-- Disabilita RLS per tabelle pubbliche (solo lettura)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_image ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_images ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON hero_image FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sponsor_images FOR SELECT USING (true);

-- Policy per scrittura admin (richiede autenticazione)
CREATE POLICY "Admin write access" ON products FOR ALL USING (true);
CREATE POLICY "Admin write access" ON hero_image FOR ALL USING (true);
CREATE POLICY "Admin write access" ON sponsor_images FOR ALL USING (true);
```

## 3. Configurazione Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://veqnfkkbwevczlufipmp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_j1inkl4kRKqXCcHkPZ4I0A_GcNq8D2i
SUPABASE_SERVICE_ROLE_KEY=sb_secret_KpuI6bQtGZhf4EVWGimgHw_fB8JGO7m
```

## 4. Avvio del Progetto

```bash
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 5. Accesso Admin

1. Vai a `/admin/login`
2. Email: `emilyboutique@arubapec.it`
3. Password: `123Emily!`

## 6. Caricamento Contenuti

### Hero Image
1. Accedi come admin
2. Vai al pannello admin (`/admin`)
3. Seleziona tab "Hero"
4. Carica un'immagine

### Sponsor Images
1. Nel pannello admin, tab "Sponsor"
2. Carica immagini per le 3 posizioni sponsor

### Prodotti
1. Nel pannello admin, tab "Prodotti"
2. Clicca "Nuovo Prodotto"
3. Compila i campi:
   - Titolo (obbligatorio)
   - Descrizione
   - Prezzo (obbligatorio)
   - Immagini (almeno una, obbligatorio)
   - Taglie (opzionale)
   - Colori (opzionale)

## Note Importanti

- Le immagini vengono caricate su Supabase Storage nel bucket `images`
- Se il bucket non esiste, le immagini verranno salvate come base64 nel database (non raccomandato per produzione)
- Assicurati che il bucket `images` sia pubblico per permettere la visualizzazione delle immagini
- Per produzione, considera l'implementazione di autenticazione più sicura per l'admin
