const {lightFlowUpdateModel} = require("../model/lightFlowUpdate")
const {storeLogModel} = require("../model/storeModel");

export namespace ConvertDataFlow {

    export class UpdateData{

        device_name: string;
        counting: Number;
        timestamp: Number

        constructor(device_name: string,counting: Number,timestamp: Number){
            this.device_name = device_name;
            this.counting = counting;
            this.timestamp = timestamp;
        }

        async haddleUpdateData(){
            const deviceName = this.device_name
            const timing = this.timestamp
            const countPeople = this.counting

            try{
                const countingPeople = await lightFlowUpdateModel.findOne({deviceName});
                if(!(countingPeople.data)){
                    await lightFlowUpdateModel.create({
                        device_name: deviceName,
                        counting: 1,
                        timestamp: timing
                    });

                    return "OK"
                }else{
                    await lightFlowUpdateModel.updateOne(
                        {"device_name": deviceName}, 
                        {"counting": countPeople});
                    
                    return "OK"
                }
            }catch(err){
                console.log(err)
                return "Error"
            }
        }   
    }

    export class InsertData{
        device_name: string;
        timestamp: Number;
        constructor (device_name: string,timestamp: Number){
            this.device_name = device_name;
            this.timestamp = timestamp;
        }
        async haddleInsertData(){
            const deviceName = this.device_name;
            const timing = this.timestamp;
            // console.log("in controller => ", deviceName, timing)

            try{
                await storeLogModel.create({
                    device_name: deviceName,
                    timestamp: timing
                });
    
                return "OK"
            }catch(err){
                console.log(err);
                return "Error"
            }
            
        }
    }

    export class FinderData{
        device_name: string;
        constructor(device_name:string){
            this.device_name = device_name;
        }

        async haddleFinderData(){
            const deviceName = this.device_name;
            const fetchData = await lightFlowUpdateModel.findOne({deviceName});
            if(fetchData.counting === 0){
                return "none-people"
            }else{
                return "have-people"
            }
        }
    }
}

