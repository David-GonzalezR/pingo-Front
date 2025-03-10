import { AuthRepository } from "../../repository/AuthRepository";
import { AuthResponse } from "../../models/AuthResponse";
import { ErrorResponse } from "../../models/ErrorResponse";

export class SaveAuthSessionUseCase{
    private authRepository: AuthRepository;

    constructor({authRepository}:{authRepository: AuthRepository}) {
        this.authRepository = authRepository;
    }

    async execute(authResponse: AuthResponse): Promise<void> {
        return await this.authRepository.saveAuthSession(authResponse);
    }
}