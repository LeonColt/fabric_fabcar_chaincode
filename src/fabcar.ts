/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Car } from './car';
import { CarFinancing, CarFinancingPayment } from './car_financing';

const carIndex = "carId~color~make~model";
const buyCarIndex = "financeId~carId~debtor~creditor~year~month-day";
const payCarIndex = "paymentId~financeId~debtor~creditor~year~month-day";

export class FabCar extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const cars: Car[] = [
            {
                docType: "car",
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'bank',
                inFinance: false,
                price: 150000000,
            },
            {
                docType: "car",
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'bank',
                inFinance: false,
                price: 300000000,
            },
            {
                docType: "car",
                color: 'green',
                make: 'Hyundai',
                model: 'Tucson',
                owner: 'bank',
                inFinance: false,
                price: 90000000,
            },
            {
                docType: "car",
                color: 'yellow',
                make: 'Volkswagen',
                model: 'Passat',
                owner: 'bank',
                inFinance: false,
                price: 280000000,
            },
            {
                docType: "car",
                color: 'black',
                make: 'Tesla',
                model: 'S',
                owner: 'bank',
                inFinance: false,
                price: 1000000000,
            },
            {
                docType: "car",
                color: 'purple',
                make: 'Peugeot',
                model: '205',
                owner: 'bank',
                inFinance: false,
                price: 90000000,
            },
            {
                docType: "car",
                color: 'white',
                make: 'Chery',
                model: 'S22L',
                owner: 'bank',
                inFinance: false,
                price: 250000000
            },
            {
                docType: "car",
                color: 'violet',
                make: 'Fiat',
                model: 'Punto',
                owner: 'bank',
                inFinance: false,
                price: 90000000
            },
            {
                docType: "car",
                color: 'indigo',
                make: 'Tata',
                model: 'Nano',
                owner: 'bank',
                inFinance: false,
                price: 150000000,
            },
            {
                docType: "car",
                color: 'brown',
                make: 'Holden',
                model: 'Barina',
                owner: 'bank',
                inFinance: false,
                price: 100000000,
            },
        ];

        for ( let i = 0; i < cars.length; ++i ) {
            await ctx.stub.putState( `AVX ${i} AA`, Buffer.from( JSON.stringify( cars[i] ) ) );
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryCar(ctx: Context, carId: string): Promise<string> {
        const carAsBytes = await ctx.stub.getState(carId); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carId} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    public async createCar(ctx: Context, carId: string, make: string, model: string, color: string, price: number) {
        console.info('============= START : Create Car ===========');

        const carAsBytes = await ctx.stub.getState(carId);
        if ( carAsBytes && carAsBytes.length > 0 ) {
            throw new Error(`${carId} already exists`);
        }

        const car: Car = {
            color,
            docType: 'car',
            make,
            model,
            owner: "bank",
            price,
            inFinance: false,
        };

        await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));

        ///"carId~color~make~model"
        const key = ctx.stub.createCompositeKey( carIndex, [carId,color,make,model] );
        await ctx.stub.putState( key, Buffer.from([0x00]) );

        console.info('============= END : Create Car ===========');
    }

    public async queryAllCars(ctx: Context): Promise<string> {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if ( record?.docType !== "car" ) continue;
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    public async changeCarOwner(ctx: Context, carId: string, newOwner: string) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carId); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carId} does not exist`);
        }
        const car: Car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

    public async queryCarFinance( ctx: Context, financeId: string ) : Promise<string> {
        const financeAsBytes = await ctx.stub.getState(financeId);
        if ( !financeAsBytes || financeAsBytes.length === 0 ) {
            throw new Error(`${financeId} does not exist`);
        }
        console.log( financeAsBytes.toString() );
        return financeAsBytes.toString();
    }

    public async queryAllCarFinances(ctx: Context): Promise<string> {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if ( record?.docType !== "carFinancing" ) continue;
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    public async queryAllCarFinancePayment(ctx: Context): Promise<string> {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if ( record?.docType !== "carFinancingPayment" ) continue;
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    public async createCarFinance( ctx: Context, financeId: string, carId: string, price: number, payPerMonth: number, debtor: string, creditor: string, timestamp: Date ) {
        console.info('============= START : createCarFinance ===========');

        const carInString = await this.queryCar( ctx, carId );
        const car: Car = JSON.parse( carInString ) as Car;

        if ( car.owner !== "bank" ) {
            throw new Error(`Unable to create finance because car is not owned by bank`);
        }

        const financing: CarFinancing = {
            docType: "carFinancing",
            carId,
            price,
            payment: 0,
            payPerMonth,
            debtor,
            creditor,
            timestamp,
        } as CarFinancing;

        await ctx.stub.putState(financeId, Buffer.from(JSON.stringify(financing)));

        const key = ctx.stub.createCompositeKey( buyCarIndex, [financeId,carId,debtor,creditor,timestamp.getFullYear().toString(),( timestamp.getMonth() + 1).toString(), timestamp.getDate().toString()] );
        await ctx.stub.putState( key, Buffer.from([0x00]) );

        //put car into in finance
        car.inFinance = true;
        await ctx.stub.putState( carId, Buffer.from( JSON.stringify( car ) ) );

        console.info('============= END : createCarFinance ===========');
    }

    public async payCarFinance( ctx: Context, financeId: string, paymentId: string, payment: number, debtor: string, creditor: string, timestamp: Date ) {
        console.info('============= START : payCarFinance ===========');

        const financeInString = await this.queryCarFinance( ctx, financeId );
        const finance: CarFinancing = JSON.parse( financeInString ) as CarFinancing;

        const carInString = await this.queryCar( ctx, finance.carId );
        const car: Car = JSON.parse( carInString ) as Car;

        const carPayment: CarFinancingPayment = {
            docType: "carFinancingPayment",
            financeId,
            payment,
            debtor,
            creditor,
            timestamp,
        } as CarFinancingPayment;

        await ctx.stub.putState(paymentId, Buffer.from(JSON.stringify(carPayment)));

        ///paymentId~financeId~debtor~creditor~year~month-day
        const key = ctx.stub.createCompositeKey( payCarIndex, [paymentId,financeId,debtor,creditor,timestamp.getFullYear().toString(),( timestamp.getMonth() + 1).toString(), timestamp.getDate().toString()] );
        await ctx.stub.putState( key, Buffer.from([0x00]) );

        finance.payment += payment;
        await ctx.stub.putState( financeId, Buffer.from( JSON.stringify( finance ) ) );
        ///change ownership if payment is full
        if ( finance.payment >= finance.price ) {
            car.owner = finance.debtor;
            car.inFinance = false;
            await ctx.stub.putState( finance.carId, Buffer.from( JSON.stringify( car ) ) );
        }

        console.info('============= END : payCarFinance ===========');
    }
}
