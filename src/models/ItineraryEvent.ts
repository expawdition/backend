export default class ItineraryEvent {
    public name: string
    public address: string
    public estimatedDuration: string
    public estimatedStartTime: string
    public description: string
    public photo?: string

    constructor(data: any) {
        this.name = data.name
        this.address = data.location
        this.estimatedDuration = data.estimatedDuration
        this.estimatedStartTime = data.estimatedStartTime
        this.description = data.description
    }

    public toObject() {
        return {
            name: this.name,
            address: this.address,
            estimatedDuration: this.estimatedDuration,
            estimatedStartTime: this.estimatedStartTime,
            description: this.description,
            photo: this.photo
        }
    }
}
