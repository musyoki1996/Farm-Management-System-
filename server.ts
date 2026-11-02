import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialise GoogleGenAI securely on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialise GoogleGenAI:', err);
  }
}

// Weather Advisory Endpoint with Kenyan regional data
app.get('/api/weather/:county', (req: Request, res: Response) => {
  const county = (req.params.county || 'nakuru').toLowerCase();
  
  const weatherDatabase: Record<string, any> = {
    nakuru: {
      county: 'Nakuru',
      subCounty: 'Rongai / Njoro',
      temperatureC: 22,
      condition: 'Partly Cloudy',
      humidity: 64,
      windSpeedKmH: 14,
      soilMoisturePct: 42,
      rainfall7DaysMm: 28.5,
      precipitationProbPct: 35,
      advisory: 'Moderate soil moisture. Ideal conditions for CAN top-dressing in maize and foliar spray application.',
      seasonStatus: 'Transition to short rains; soil temperature 19°C suitable for seed germination.',
    },
    'uasin gishu': {
      county: 'Uasin Gishu',
      subCounty: 'Moiben / Eldoret East',
      temperatureC: 20,
      condition: 'Overcast with light showers',
      humidity: 78,
      windSpeedKmH: 11,
      soilMoisturePct: 58,
      rainfall7DaysMm: 52.0,
      precipitationProbPct: 70,
      advisory: 'High relative humidity. Monitor wheat and maize fields for fungal rust and northern corn leaf blight.',
      seasonStatus: 'Late vegetative stage. Ensure drainage furrows are clear to prevent waterlogging.',
    },
    kiambu: {
      county: 'Kiambu',
      subCounty: 'Limuru / Gatundu',
      temperatureC: 19,
      condition: 'Misty morning, sunny afternoon',
      humidity: 72,
      windSpeedKmH: 9,
      soilMoisturePct: 48,
      rainfall7DaysMm: 34.0,
      precipitationProbPct: 25,
      advisory: 'Favourable conditions for coffee berry development and tea plucking flush cycles.',
      seasonStatus: 'Coffee flowering stage. Recommended application of copper-based protectant fungicide for CBD.',
    },
    machakos: {
      county: 'Machakos',
      subCounty: 'Mwala / Kathiani',
      temperatureC: 26,
      condition: 'Sunny & Dry',
      humidity: 44,
      windSpeedKmH: 18,
      soilMoisturePct: 28,
      rainfall7DaysMm: 6.0,
      precipitationProbPct: 10,
      advisory: 'High evapotranspiration rate. Activate drip irrigation cycles for French beans and avocado orchards.',
      seasonStatus: 'Dry spell. Prioritize mulching and night-time drip irrigation to minimize evaporation losses.',
    },
    meru: {
      county: 'Meru',
      subCounty: 'Imenti South / Buuri',
      temperatureC: 21,
      condition: 'Scattered Showers',
      humidity: 68,
      windSpeedKmH: 12,
      soilMoisturePct: 50,
      rainfall7DaysMm: 41.5,
      precipitationProbPct: 45,
      advisory: 'Adequate soil water reserve. Good timing for potato tuber bulking and macadamia nut growth.',
      seasonStatus: 'Optimal growing season. Scouting for potato late blight recommended every 3 days.',
    },
    kilifi: {
      county: 'Kilifi',
      subCounty: 'Malindi / Kaloleni',
      temperatureC: 29,
      condition: 'Warm & Humid with Coastal Breeze',
      humidity: 82,
      windSpeedKmH: 22,
      soilMoisturePct: 34,
      rainfall7DaysMm: 14.0,
      precipitationProbPct: 20,
      advisory: 'Coastal sandy loam dries fast. Maintain regular drip cycles for passion fruit and cassava.',
      seasonStatus: 'Ensure livestock tick control dips are active due to high humidity parasite pressure.',
    },
  };

  const data = weatherDatabase[county] || weatherDatabase['nakuru'];
  res.json({ success: true, data });
});

// M-Pesa Daraja Payment Simulator Endpoint
app.post('/api/mpesa/simulate', (req: Request, res: Response) => {
  const { type, amount, phone, reference, recipientName } = req.body;
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const transId = `QK${Math.floor(10000000 + Math.random() * 90000000)}`;

  // Return realistic Daraja API payload
  if (type === 'B2C' || type === 'PAYROLL') {
    res.json({
      success: true,
      ConversationID: `AGR-CNV-${Date.now()}`,
      OriginatorConversationID: `AGR-ORG-${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Accept the service request successfully.',
      TransactionID: transId,
      TransactionAmount: amount,
      RecipientPhone: phone || '254712345678',
      RecipientName: recipientName || 'Farm Worker / Supplier',
      TransactionDate: timestamp,
      ResultType: 0,
      ResultCode: 0,
      ResultDesc: `The service request is processed successfully. KES ${amount} transferred to ${recipientName || phone}.`,
    });
  } else {
    // C2B / STK Push Simulation
    res.json({
      success: true,
      MerchantRequestID: `AGR-REQ-${Date.now()}`,
      CheckoutRequestID: `ws_CO_${Date.now()}_988707`,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing',
      TransactionID: transId,
      Amount: amount,
      Reference: reference || 'MILK-PAYMENT',
      Status: 'COMPLETED',
      Timestamp: timestamp,
    });
  }
});

// AGRICORE AI Agricultural Intelligence Assistant
app.post('/api/gemini/advisor', async (req: Request, res: Response) => {
  const { question, context, farmType } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const systemInstruction = `You are AGRICORE AI, an enterprise-grade Agricultural Intelligence Specialist and Senior Agronomist serving Kenyan and East African farmers, farm managers, and agribusiness enterprises.
You provide precise, scientifically sound, economically actionable agronomic and farm management counsel tailored to the agro-ecological zones of Kenya (e.g. Rift Valley, Central Highlands, Western, Coastal, and ASAL regions).
Key domain knowledge:
- Kenyan crop varieties (e.g. Kenya Seed Maize H614D, H6213, Katumani for drylands; Shangi & Dutch Robijn potatoes; SL28 & Ruiru 11 coffee; Hass & Fuerte avocados; Anna F1 & Cal J tomatoes; French beans for export).
- Integrated Pest & Disease Management: Fall Armyworm, Maize Lethal Necrosis (MLND), Tuta Absoluta, Bacterial Wilt, Coffee Berry Disease (CBD), Late Blight, Black Sigatoka in bananas.
- Livestock & Dairy: Friesian, Ayrshire, Jersey, Sahiwal, Boran; mastitis prevention (California Mastitis Test), Total Mixed Ration (TMR), silage making with Napier grass & desmodium, vaccination against East Coast Fever (ECF), FMD, Anthrax, Newcastle disease in poultry.
- Agricultural Economics in Kenya: Calculations in Kenyan Shillings (KES), gross margin analysis, fertilizer application rates (DAP, CAN, NPK 17:17:17, Urea, foliar sprays).
- Weather cycles: Kenyan Long Rains (March - May) and Short Rains (October - December).
- Always include helpful, structured recommendations with dosage/action items, economic implications in KES, and appropriate professional vet/agronomist advisory caveats.`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Farm Context: ${context || 'General Kenyan Commercial Farm'}
Farm Focus: ${farmType || 'Mixed Crop & Livestock'}
Farmer/Manager Query: ${question}

Provide an authoritative, detailed, well-structured response with clear headings, bullet points, dosages or metrics where applicable, and specific Kenya-market recommendations.`,
        config: {
          systemInstruction,
        },
      });

      return res.json({
        success: true,
        answer: response.text,
        source: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, generating expert agronomic response:', err?.message);
    }
  }

  // Domain fallback agronomist knowledge engine if key not yet attached or quota exceeded
  const agronomicKnowledgeBase: Record<string, string> = {
    fertilizer: `### Optimal Fertilizer Schedule for Kenyan Maize & Horticulture
1. **Basal Planting Fertilizer (Acres Basis):**
   - Apply **DAP (Di-Ammonium Phosphate) or NPK 23:23:0** at 50 kg per acre (approx. 1 bag).
   - Place fertilizer 5 cm to the side and 2 cm below seed level to prevent seedling burn.
   - Current market cost estimate: **KES 4,500 – 5,500 per 50kg bag**.

2. **Top-Dressing (First Application at Knee-High / 4-6 Weeks):**
   - Apply **CAN (Calcium Ammonium Nitrate)** at 50-75 kg per acre when maize is knee-high (V6-V8 stage).
   - Alternatively, use Urea (46% N) at 35 kg/acre if soil moisture is consistently high.
   - Cost: **KES 3,800 – 4,400 per bag**.

3. **Foliar Nutrition & Trace Minerals:**
   - Apply Zinc and Boron foliar spray (e.g. Easygro or Omex) during tasseling/flowering for optimal grain filling.

*Note: Soil testing through KALRO or certified laboratories is recommended every 2 seasons to correct soil acidity (apply agricultural lime if pH < 5.5).*`,

    dairy: `### Dairy Milk Production & Feed Optimization Protocol
1. **Dry Matter (DM) Intake Calculation:**
   - A high-yielding lactating Friesian/Ayrshire cow requires **3.5% to 4.0% of body weight in dry matter daily** (approx. 16-18 kg DM for a 450kg cow).
   - Ratio: **70% quality forage (Silage/Hay/Napier)** + **30% concentrates (Dairy Meal)**.

2. **Target Feeding Formula:**
   - Base maintenance: 15-20 kg chopped Napier grass or maize silage + 4 kg Rhodes grass hay.
   - Production feed: Add **1 kg of 16% CP Dairy Meal for every 2.0 to 2.5 litres of milk produced** above 10 litres base.
   - Provide **100-150g of macro-mineral lick** (Maclik Super or Dairy Mineral Premix) daily with ad-libitum clean water (60-90 litres/day).

3. **Mastitis Control & Udder Hygiene:**
   - Perform California Mastitis Test (CMT) weekly.
   - Post-milking teat dip with iodine-based sanitizer reduces new intra-mammary infections by over 65%.`,

    pest: `### Integrated Pest Management: Fall Armyworm & Tuta Absoluta
1. **Fall Armyworm (*Spodoptera frugiperda*) in Maize:**
   - **Scouting Threshold:** Initiate control when 10% of plants in vegetative stage show pinhole feeding damage or frass in the whorl.
   - **Recommended Control Options:**
     - *Bio-pesticides:* *Bacillus thuringiensis* (Bt) or Neem extract (Nimbecidine) for early instar stages.
     - *Chemical spray:* Emamectin Benzoate (e.g. Prove / Escort 50g/ha) or Chlorantraniliprole (Coragen 20 SC at 150ml/ha).
     - *Application technique:* Direct spray nozzle straight down into the maize funnel/whorl in the early morning or evening.

2. **Tuta Absoluta in Tomatoes (Greenhouse & Open Field):**
   - Install delta pheromone traps at 4-6 traps per acre to monitor moth populations.
   - Alternate chemical modes of action: Spinetoram (Radiant) and Indoxacarb to prevent resistance development.
   - Remove and destroy infested fruit and leaf mines promptly.`,
  };

  const lowerQ = question.toLowerCase();
  let fallbackAnswer = '';
  if (lowerQ.includes('fertil') || lowerQ.includes('maize') || lowerQ.includes('npk') || lowerQ.includes('dap') || lowerQ.includes('can')) {
    fallbackAnswer = agronomicKnowledgeBase.fertilizer;
  } else if (lowerQ.includes('milk') || lowerQ.includes('cow') || lowerQ.includes('dairy') || lowerQ.includes('feed') || lowerQ.includes('cattle')) {
    fallbackAnswer = agronomicKnowledgeBase.dairy;
  } else if (lowerQ.includes('pest') || lowerQ.includes('disease') || lowerQ.includes('worm') || lowerQ.includes('spray') || lowerQ.includes('tuta')) {
    fallbackAnswer = agronomicKnowledgeBase.pest;
  } else {
    fallbackAnswer = `### AGRICORE Agronomic Evaluation
**Analysis for:** "${question}"

1. **Agro-Ecological Assessment:**
   - In Kenyan farming zones (Medium to High Potential areas such as Rift Valley, Central, and Western Kenya), crop and livestock productivity depends strongly on seasonal rainfall timing (Long Rains March–May, Short Rains October–December).
   - Ensure your planting dates coincide with reliable soil moisture above 40%.

2. **Economic & Input Optimization:**
   - Current market benchmarks indicate input costs represent 55–65% of gross farm expenditure in Kenya.
   - Re-evaluate supplier invoices using AGRICORE's Procurement module to negotiate bulk discounts on certified seed (KEPHIS approved) and bulk fertilizers.

3. **Recommended Immediate Action:**
   - Record and track daily field operations in the AGRICORE Task Management module.
   - Check local soil testing reports to calibrate nitrogen and phosphorus requirements before applying high-cost fertilizers.
   - Consult your assigned sub-county agricultural extension officer or licensed veterinarian for on-site verification.`;
  }

  return res.json({
    success: true,
    answer: fallbackAnswer,
    source: 'agricore-agronomy-engine',
  });
});

// Production / Dev Vite middleware handling
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AGRICORE Enterprise Server running on port ${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
