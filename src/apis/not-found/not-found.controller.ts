import { Controller, Get, Render, Res } from '@nestjs/common';

@Controller()
export class NotFoundController {
    @Get('*')
    @Render('index')
    root(@Res() res) {
        return res.status(404);
    }
}
