import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    // $value 是用户输入的值
    // $property 是属性名
    // $target 是目标对象
    // $constraint1 是最小长度
    // $constraint2 是最大长度
    message: `用户名长度为$constraint1-$constraint2个字符`,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
