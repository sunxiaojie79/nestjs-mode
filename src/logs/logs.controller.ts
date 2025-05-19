import { Controller, Get, Post, Body } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { Serialize } from 'src/decorators/serialize.decorator';
class LogDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;
}

class PublicLogDto {
  @Expose()
  msg: string;
}
@Controller('logs')
export class LogsController {
  @Get()
  // @UseInterceptors(SerializeInterceptor)
  getLogs() {
    return [11];
  }

  @Post()
  @Serialize(PublicLogDto)
  postLog(@Body() dto: LogDto) {
    console.log('🚀 ~ LogsController ~ postLog ~ dto:', dto);
    return dto;
  }
}
