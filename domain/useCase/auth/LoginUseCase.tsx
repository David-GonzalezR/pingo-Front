import { AuthRepository } from "../../repository/AuthRepository";
import { AuthResponse } from "../../models/AuthResponse";
import { ErrorResponse } from "../../models/ErrorResponse";

export class LoginUseCase {
    private authRepository: AuthRepository;

    constructor({authRepository}:{authRepository: AuthRepository}) {
        this.authRepository = authRepository;
    }

    async execute(email: string, password: string): Promise<AuthResponse | ErrorResponse> {
        return await this.authRepository.login(email, password);
    }
}