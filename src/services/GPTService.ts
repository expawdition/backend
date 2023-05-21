import { Configuration, OpenAIApi } from 'openai'
// **** Variables **** //

// Errors

// **** Functions **** //
const configuration = new Configuration({
    apiKey: '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',
})
const openai = new OpenAIApi(configuration)

export async function gpt(): Promise<string | undefined> {
    try {
        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: 'Create an itinerary for a day trip in New York',
                },
            ],
            temperature: 0.7,
        })
        return result.data.choices[0].message?.content
    } catch (error) {
        if (error.response) {
            console.log(error.response.status)
            console.log(error.response.data)
        } else {
            console.log(error.message)
        }
    }
}

gpt()

// **** Export default **** //

export default {
    gpt,
} as const
