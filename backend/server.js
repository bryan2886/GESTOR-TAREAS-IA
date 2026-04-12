import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  OpenAI  from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
    baseURL: process.env.API_URL,
    apiKey: process.env.API_KEY,
});

app.post("/how-to",async (req,res)=>{
    const { task } = req.body || {};

    
    if(task === null || typeof task !== "string" || task.trim() === "" ){
        return res.status(400).json({
            error: "Error tarea no enviada",
        });
    }

    
    

    try{
        const systemPrompt = `Eres un asistente que ayuda a los 
        usuarios a realizar tareas. 
        Proporciona instrucciones claras y 
        concisas para completar la tarea solicitada.
        obligatoriamente debes entregar la respues maximo en 1000 caracteres, 
        no des saludos, ni despedidas. 
        no se debe notar que eres un agente de IA, 
        responde exclusivamente el texto`;
        const userPrompt = `Explica de manera breve (max 1000 caracteres)como hacer la tarea "${task}"`;

        const completion = await client.chat.completions.create({
            model: process.env.MODEL,
            messages:[
                {role: "system", content: systemPrompt},
                {role: "user", content: userPrompt},
            ],
        })

        let text = completion.choices[0].message.content.trim();
        return res.json({
            text,
        });

    }catch(error){
        return res.status(500).json({
            error: "Error al procesar la solicitud",
            details: error.message,
            
        })

    }
    return res.json({
        text: "holaa",
    });
})

app.listen(3000,()=>{
    console.log("Servidor iniciado en el puerto 3000");
})