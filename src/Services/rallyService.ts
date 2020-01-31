
import * as request from "request-promise";
export interface LatLng{
    Lat:number;
    Long:number;
}
export interface city{
    CityStateAbbr:string;
}
export interface schedule{
    OriginCity:city;
    OriginDepartureLocation:string;
    DestinationCity:city;
    DestinationArrivalTime:string;
}
export interface state{
    RidersBookedOnTrip:number;
}
export interface rallyTrip{
    DerivedPickupLatLng:LatLng;
    State:state;
    Schedule:schedule;
}
export class rallyService{
    public async getTrips(eventId:string):Promise<rallyTrip[]>{
        let result = await request.get(`https://rally-booking-preprod.azurewebsites.net/api/v1/booking-get-trips/${eventId}`);
        return (<rallyTrip[]>JSON.parse(result));
    }
}