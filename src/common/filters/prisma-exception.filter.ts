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
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // =========================
    // P2002 - UNIQUE constraint
    // =========================
    if (exception.code === 'P2002') {
      // const meta = exception.meta as
      //   | {
      //       target?: string[];
      //     }
      //   | undefined;

      // const fields = meta?.target ?? [];

      // const field =
      //   fields.map((f) => fieldNames[f] || f).join(', ') || 'Dữ liệu';

      const meta = exception.meta as
        | {
            target?: string[];
            driverAdapterError?: {
              cause?: { constraint?: { fields?: string[] } };
            };
          }
        | undefined;

      const fields =
        meta?.driverAdapterError?.cause?.constraint?.fields ??
        meta?.target ??
        [];

      const field =
        fields.map((f) => fieldNames[f] || f).join(', ') || 'Dữ liệu';

      return response.status(409).json({
        statusCode: 409,
        message: `${field} đã tồn tại, vui lòng chọn giá trị khác`,
        error: 'Conflict',
      });
    }

    // =========================
    // P2025 - Record not found
    // =========================
    if (exception.code === 'P2025') {
      return response.status(404).json({
        statusCode: 404,
        message: 'Không tìm thấy dữ liệu',
        error: 'Not Found',
      });
    }

    // =========================
    // Prisma error khác
    // =========================
    return response.status(500).json({
      statusCode: 500,
      message: 'Có lỗi xảy ra khi xử lý dữ liệu',
      error: 'Internal Server Error',
    });
  }
}
