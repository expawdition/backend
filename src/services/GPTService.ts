import { Configuration, OpenAIApi } from 'openai'
import TripData from '../models/TripData'

// **** Variables **** //
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_KEY,
// })
// const openai = new OpenAIApi(configuration)

// **** Functions **** //
export async function gpt(
    tripData: TripData,
    key?: string
): Promise<string | undefined | void> {
    const configuration = new Configuration({
        apiKey: key,
    })
    const openai = new OpenAIApi(configuration)

    try {
        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an experienced travel agent that speaks only in JSON. Do not speak normal text.',
                },
                {
                    role: 'user',
                    content: tripData.getPrompt(),
                },
            ],
            temperature: 0.7,
        })
        console.log(tripData.getPrompt())
        console.log(result.data.choices[0].message?.content)
        return result.data.choices[0].message?.content
    } catch (error) {
        if (error.response) {
            console.error(`Error Status: ${error.response.status}`)
            console.error(`Error Data: ${error.response.data}`)
        } else {
            console.error(`Error Message: ${error.message}`)
        }
        return error
    }
}

// **** Export default **** //

export default gpt
