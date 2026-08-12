import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';

const fieldNames: Record<string, string> = {
  email: 'Email',
  slug: 'Slug',
  sku: 'Mã sản phẩm (SKU)',
  orderNumber: 'Mã đơn hàng',
  name: 'Tên',
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 'P2002') {
      // Prisma 7 (driver adapter) đặt tên field ở đây:
      const fields: string[] =
        exception.meta?.driverAdapterError?.cause?.constraint?.fields ??
        exception.meta?.target ??
        [];

      const field =
        fields.map((f: string) => fieldNames[f] || f).join(', ') || 'Dữ liệu';

      return response.status(409).json({
        statusCode: 409,
        message: `${field} đã tồn tại, vui lòng chọn giá trị khác`,
      });
    }

    if (exception.code === 'P2025') {
      return response.status(404).json({
        statusCode: 404,
        message: 'Không tìm thấy dữ liệu cần cập nhật',
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Có lỗi xảy ra khi xử lý dữ liệu',
    });
  }
}
