import { AuthRepository } from "../../repository/AuthRepository";
import { AuthResponse } from "../../models/AuthResponse";
import { ErrorResponse } from "../../models/ErrorResponse";

export class GetAuthSessionUseCase{
    private authRepository: AuthRepository;

    constructor({authRepository}:{authRepository: AuthRepository}) {
        this.authRepository = authRepository;
    }

    async execute(): Promise<AuthResponse> {
        return await this.authRepository.getAuthSession();
    }
}