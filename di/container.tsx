import { asClass, createContainer } from "awilix";
import { AuthService } from "../data/sources/remote/services/AuthService";
import { AuthRepositoryImpl } from "../data/repository/AuthRepositoryImpl";
import { LoginUseCase } from "../domain/useCase/auth/LoginUseCase";
import { LoginViewModel } from "../presentation/screens/auth/login/LoginViewModel";
import { RegisterViewModel } from "../presentation/screens/auth/register/RegisterViewModel";
import { RegisterUseCase } from "../domain/useCase/auth/RegisterUseCase";

 const container = createContainer();

 container.register({
   //servicios
    authService: asClass(AuthService).singleton(),

    //REPOSITORY
    authRepository:asClass(AuthRepositoryImpl).singleton(),

    //USE CASE
    loginUseCase:asClass(LoginUseCase).singleton(),
    registerUseCase:asClass(RegisterUseCase).singleton(),

    //VIEWMODEL
    loginViewModel :asClass(LoginViewModel).singleton(),
    registerViewModel :asClass(RegisterViewModel).singleton(),

 });
 export {container};