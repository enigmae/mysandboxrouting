import { expect } from 'chai';
import { rallyService, rallyTrip } from '../src/Services/rallyService';

describe("rallyService",()=>{
    it('can get the rally trip data',  ()=>{
        let service = new rallyService();
        return service.getTrips('100264').then((result)=>{
        expect(result[0].Schedule.OriginDepartureLocation).eq('5050 Town Center Circle');
        expect(result[0].Schedule.DestinationCity.CityStateAbbr).eq('Miami Gardens, FL');
        });
    })
});