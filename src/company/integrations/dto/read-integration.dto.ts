import { IsEnum, IsNotEmpty } from "class-validator";
import { IntegrationProviders } from "../../../common/third-party/interfaces";

export class ReadIntegrationDto { 
    @IsEnum(IntegrationProviders)
    @IsNotEmpty()
    type: IntegrationProviders;
}
