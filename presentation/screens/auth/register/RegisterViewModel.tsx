import { AuthResponse } from "../../../../domain/models/AuthResponse";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { User } from "../../../../domain/models/User";
import { AuthUseCases } from "../../../../domain/useCase/auth/AuthUseCases";
import { RegisterUseCase } from "../../../../domain/useCase/auth/RegisterUseCase";

export class RegisterViewModel{

private authUseCases: AuthUseCases;

    constructor({authUseCases}:{authUseCases: AuthUseCases}){
       this.authUseCases=authUseCases;
    }

    async register(user:User): Promise<AuthResponse | ErrorResponse>{
        return await this.authUseCases.register.execute(user);
    }
    
}