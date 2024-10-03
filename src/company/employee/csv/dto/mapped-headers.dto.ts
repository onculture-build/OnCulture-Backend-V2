import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNotEmpty } from 'class-validator';

export class MappedHeadersDto {
  @ApiProperty({
    description:
      'A key-value map where keys are dynamic and values are strings',
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
  })
  @IsObject()
  @IsNotEmpty()
  mappedHeaders: { [key: string]: string };
}
