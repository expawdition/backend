import { Configuration, OpenAIApi } from 'openai'
import TripData from '../models/TripData'

// **** Variables **** //
const configuration = new Configuration({
    apiKey: "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"
})
const openai = new OpenAIApi(configuration)

// **** Functions **** //
export async function gpt(tripData: TripData): Promise<string | undefined | void> {
    try {
        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an experienced travel agent that speaks only in JSON. Do not speak normal text.'
                },
                {
                    role: 'user',
                    content: tripData.getPrompt(),
                },
            ],
            temperature: 0.7,
        })
        console.log(result.data.choices[0].message?.content);
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

let tripData = new TripData(
    {
        destination: "Vancouver",
        date: "August 10, 2023",
        startTime: "10AM",
        endTime: "9PM",
        numberOfPeople: 10,
        groupType: 'family',
        budget: "$$",
        transportationMethod: 'car',
        mustDo: 'nothing',
        wheelChairFriendly: false
    }
)

gpt(tripData);
// **** Export default **** //

export default {
    gpt,
} as const
