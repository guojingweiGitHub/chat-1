import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { ImportDataDto } from './dto/import.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';

@Controller('import')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('recognize')
  @Roles('admin', 'campus_manager', 'receptionist')
  @UseInterceptors(FileInterceptor('file'))
  async recognizeTable(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { success: false, message: '请上传文件' };
    }
    return this.importService.recognizeTable(file.buffer, file.originalname);
  }

  @Post('map-fields')
  @Roles('admin', 'campus_manager', 'receptionist')
  async autoMapFields(@Body() body: { headers: string[] }) {
    return this.importService.autoMapFields(body.headers);
  }

  @Post('validate')
  @Roles('admin', 'campus_manager', 'receptionist')
  async validateData(@Body() body: { data: any[]; type: string }) {
    return this.importService.validateData(body.data, body.type);
  }

  @Post('execute')
  @Roles('admin', 'campus_manager', 'receptionist')
  async executeImport(@Body() dto: ImportDataDto) {
    return this.importService.executeImport(dto);
  }
}
