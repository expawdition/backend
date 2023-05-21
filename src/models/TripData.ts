export default class TripData {
    public destination: string
    public date: string
    public startTime: string
    public endTime: string
    public numberOfPeople: number
    public groupType: string
    public budget: string
    public transportationMethod: string
    public mustDo: string[]
    public wheelChairFriendly: boolean

    constructor(data: any) {
        this.destination = data.destination
        this.date = data.date
        this.startTime = data.startTime
        this.endTime = data.endTime
        this.numberOfPeople = data.numberOfPeople

        // Set the group type
        switch (data.groupType) {
            case 'family':
                this.groupType = "we're a family";
                break
            case 'date':
                this.groupType = "we're dating";
                break
            case 'coworkers':
                this.groupType = "we're coworkers";
                break
            case 'solo adventure':
                this.groupType = 'i am travelling alone';
                break
			default:
				this.groupType = "we're a group of friends";
        }

        // Set the budget based on the input data
        switch (data.budget) {
            case '$':
                this.budget = 'budget-friendly'
                break
            case '$$':
                this.budget = 'moderately-priced'
                break
            case '$$$':
                this.budget = 'high-end'
                break
            case '$$$$':
                this.budget = 'luxury'
                break
            default:
                this.budget = 'no preference'
        }

        this.transportationMethod = data.transportationMethod
        this.mustDo = data.mustDo
        this.wheelChairFriendly = data.wheelChairFriendly
    }

    public getPrompt() {
        const prompt = `I'm planning a trip to ${this.destination} on ${
            this.date
        }. We're a group of ${this.numberOfPeople} and ${
            this.groupType
        }. We plan to start our day at ${this.startTime} and end around ${
            this.endTime
        }. We're looking for places and activities that align with a ${
            this.budget
        } budget. We prefer to get around by ${
            this.transportationMethod
        }, and one place we absolutely must visit is ${
            this.mustDo
        }. ${
            this.wheelChairFriendly
                ? 'In terms of accessibility, it is important that our itinerary is wheelchair-friendly'
                : ''
        }. Could you help us draft an itinerary that would maximize our experience? Could you suggest a list of places to visit and activities to do, keeping in mind the types of activities and general geographic proximity? By estimating approximate transit times between each destination using ${ this.transportationMethod } and estimating the average duration that a group of our size will usually spend here, make sure the trip can be finished within the time frame of ${ this.startTime } to ${ this.endTime }. PLease return the itinerary back as a JSON object with an array of results. This is what the JSON should look like: [
			{
			  "name": "name of place",
			  "location": "address",
			  "estimatedDuration": "1 hour 30 minutes",
			  "estimatedStartTime": "10 AM"
			  "description": "why you should come here or what you should do"
			},
			{
			  "name": "name of place",
			  "location": "address",
			  "estimatedDuration": "2 hours",
			  "estimatedStartTime": "12 PM",
			  "description": ""why you should come here or what you should do"
			}]. Do NOT return any other information.
        `
        return prompt
    }
}
