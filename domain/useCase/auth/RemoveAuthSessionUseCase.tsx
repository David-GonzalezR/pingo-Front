import { AuthRepository } from "../../repository/AuthRepository";
import { AuthResponse } from "../../models/AuthResponse";
import { ErrorResponse } from "../../models/ErrorResponse";

export class RemoveAuthSessionUseCase{
    private authRepository: AuthRepository;

    constructor({authRepository}:{authRepository: AuthRepository}) {
        this.authRepository = authRepository;
    }

    async execute(): Promise<void> {
        await this.authRepository.removeAuthSession();
    }
}