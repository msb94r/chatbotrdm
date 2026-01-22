const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION MISTRAL ---
const MISTRAL_API_KEY = "Tf7TXD5Q18xN1tk2p0H7Rt73PXHLDNpV"; // Ta clé est ici !
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

// --- LE CERVEAU DU SPA (Prompt Système) ---
// C'est ici qu'on définit la personnalité et les connaissances de l'IA
const SYSTEM_PROMPT = `
Tu es l'assistant virtuel de "Rituels du Monde", un spa immersif en Bretagne.
Ton ton : calme, inspirant, bienveillant et chaleureux.

Tes Connaissances (Services) :
1. EUROPE : Vinothérapie (Caudalie), Massage Suédois, Massage Blue Lagoon.
2. ASIE : Massage Balinais, Ayurvédique, Shiatsu, Kobido (visage).
3. AFRIQUE & ORIENT : Hammam, Gommage savon noir, Enveloppement Rhassoul.
4. POLYNÉSIE : Lomi-Lomi, Rituels floraux.
5. AMÉRIQUES : Deep Tissue (massage sportif).
6. ACTIVITÉ SPÉCIALE : "Zen & Cats Yoga" (Yoga avec des chats).

Tes Règles :
- Réponds TOUJOURS en français.
- Fais des réponses courtes (max 3 phrases).
- Si le client veut réserver, dis-lui de cliquer sur l'onglet "Réserver".
- Sois vendeur mais très zen.
`;

app.post('/ask', async (req, res) => {
    try {
        console.log("Question reçue :", req.body.message);

        const response = await axios.post(
            MISTRAL_URL,
            {
                model: "mistral-small-latest", // Modèle rapide et intelligent
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: req.body.message }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`
                }
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        console.log("Réponse IA :", aiResponse);
        
        res.json({ text: aiResponse });

    } catch (error) {
        console.error("Erreur Mistral:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erreur de connexion à l'IA." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Serveur IA connecté à Mistral sur http://localhost:${PORT}`));