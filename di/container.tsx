import { asClass, createContainer } from "awilix";
import { AuthService } from "../data/sources/remote/services/AuthService";
import { AuthRepositoryImpl } from "../data/repository/AuthRepositoryImpl";
import { LoginUseCase } from "../domain/useCase/auth/LoginUseCase";
import { LoginViewModel } from "../presentation/screens/auth/login/LoginViewModel";
import { RegisterViewModel } from "../presentation/screens/auth/register/RegisterViewModel";
import { RegisterUseCase } from "../domain/useCase/auth/RegisterUseCase";
import { LocalStorage } from "../data/sources/local/LocalStorage";
import { SaveAuthSessionUseCase } from "../domain/useCase/auth/SaveAuthSessionUseCase";
import { GetAuthSessionUseCase } from "../domain/useCase/auth/GetAuthSessionUseCase";
import { RemoveAuthSessionUseCase } from "../domain/useCase/auth/RemoveAuthSessionUseCase";
import { AuthUseCases } from "../domain/useCase/auth/AuthUseCases";

 const container = createContainer();

 container.register({
   //servicios
    authService: asClass(AuthService).singleton(),
    localStorage: asClass(LocalStorage).singleton(),
    //REPOSITORY
    authRepository:asClass(AuthRepositoryImpl).singleton(),

    //USE CASE
    loginUseCase:asClass(LoginUseCase).singleton(),
    registerUseCase:asClass(RegisterUseCase).singleton(),
   saveAuthSessionUseCase:asClass(SaveAuthSessionUseCase).singleton(),
    getAuthSessionUseCase:asClass(GetAuthSessionUseCase).singleton(),
    removeAuthSessionUseCase:asClass(RemoveAuthSessionUseCase).singleton(),
    authUseCases:asClass(AuthUseCases).singleton(),

    //VIEWMODEL
    loginViewModel :asClass(LoginViewModel).singleton(),
    registerViewModel :asClass(RegisterViewModel).singleton(),

 });
 export {container};