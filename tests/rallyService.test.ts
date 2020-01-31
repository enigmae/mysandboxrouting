import { expect } from 'chai';
import { rallyService, rallyTrip } from '../src/Services/rallyService';
import deepEqual from 'deep-equal';
import {ILocationRider} from '../src/Controls/locationRiderControl';
describe("rallyService",()=>{
    it('can get the rally trip data',  ()=>{
        let service = new rallyService();
        return service.getTrips('100264').then((result)=>{
        expect(result[0].Schedule.OriginDepartureLocation).eq('5050 Town Center Circle');
        expect(result[0].Schedule.DestinationCity.CityStateAbbr).eq('Miami Gardens, FL');
        });
    })
});
describe("deep-equal",()=>{
    it('is deeply equal',()=>{
        let locRider:ILocationRider = {SearchResult:'myresult', Coords:{Lat:1, Long:2}};
        let locRider2:ILocationRider = {SearchResult:'myresult', Coords:{Lat:1, Long:2}};
        let locRider3:ILocationRider = {SearchResult:'myresult', Coords:{Lat:1, Long:1}};
        
        let eq = deepEqual(locRider, locRider2);
        expect(eq).true;
        eq = deepEqual( [locRider], [locRider2]);
        expect(eq).true;
        eq = deepEqual( [locRider, locRider], [locRider2]);
        expect(eq).false;
        eq = deepEqual( [locRider3], [locRider2]);
        expect(eq).false;
    });
})