# Variabili d'Ambiente

Questa cartella contiene le variabili d'ambiente necessarie per il progetto Emily Boutique.

## Come utilizzare

1. Copia il contenuto del file `variables.env` 
2. Crea un file `.env.local` nella root del progetto (cartella principale)
3. Incolla le variabili nel file `.env.local`

**Importante:** Il file `.env.local` è già nel `.gitignore` e non verrà committato su GitHub per sicurezza.

## Variabili richieste

- `NEXT_PUBLIC_SUPABASE_URL` - URL del progetto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chiave pubblica anonima di Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chiave di servizio Supabase (opzionale, per operazioni admin)

## Per Vercel/Deploy

Quando fai il deploy su Vercel o altre piattaforme:

1. Vai nelle impostazioni del progetto
2. Aggiungi le variabili d'ambiente nella sezione "Environment Variables"
3. Assicurati che le variabili `NEXT_PUBLIC_*` siano marcate come "Public" se necessario
