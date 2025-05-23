import { PartialType } from '@nestjs/mapped-types';

import { CreateApartmentDTO } from './create-apartment.dto';

export class UpdateApartmentDTO extends PartialType(CreateApartmentDTO) {}
