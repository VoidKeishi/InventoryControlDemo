# Victoria Motors — Inventory & BOM Management Demo

## Mục đích

Đây là bản **demo** để trình bày cho khách hàng Victoria Motors — nhà sản xuất xe máy điện tại Việt Nam (~200 nhân viên, nhiều dây chuyền lắp ráp). Mục tiêu là chứng minh giải pháp ERP giải quyết được pain point thực tế của họ, để khách hàng đồng ý ký hợp đồng Phase 1.

**Đây KHÔNG phải production code.** Không cần xử lý edge case phức tạp, không cần security, không cần optimize performance. Ưu tiên: trông chuyên nghiệp, data realistic, luồng hoạt động mượt, dễ hiểu với người không có background kỹ thuật.

## Bối cảnh khách hàng

### Pain point hiện tại

Victoria Motors quản lý kho bằng Excel + MISA (phần mềm kế toán offline). Vấn đề chính:

- **Đơn mua = danh sách vật liệu cho 1 mẫu xe** (tương đương BOM nhưng không được quản lý như BOM). BOM thay đổi theo thời gian cho cùng mẫu xe.
- **Dùng chéo vật liệu**: ốc từ đơn mua xe X bị lấy cho xe Y, không track được.
- **Không tính được tồn kho thực tế theo SKU**: vì nhập theo đơn mua, dùng chéo lẫn nhau, nên không biết còn bao nhiêu.
- **Không trả lời được "còn sản xuất được bao nhiêu xe X"**: phải tra sheet thủ công, nhớ xe X cần bao nhiêu ốc loại gì, rồi tự chia.
- **Kho trên Excel không khớp kho trên MISA**.
- **Luồng xuất kho bị phá vỡ**: quy trình chuẩn là quản lý kho làm phiếu xuất → nhân viên kho lấy theo phiếu. Thực tế do quá tải, nhân viên kho tự lấy → quản lý update Excel sau.

### Giải pháp cốt lõi

- Quản lý BOM 2 đầu: **Purchase BOM** (đơn mua nguyên liệu) và **Production BOM** (định mức sản xuất theo mẫu xe).
- Theo dõi tồn kho **theo SKU/vật liệu**, không theo đơn mua. Khi nhập kho, vật liệu mất danh tính đơn mua.
- Tính toán tức thì: còn sản xuất được bao nhiêu xe X (dựa trên tồn kho ÷ định mức BOM, lấy min = bottleneck).

### Stakeholder xem demo

Người xem demo là stakeholder không có background kỹ thuật và chưa từng dùng ERP. Giao diện cần trực quan, dùng ngôn ngữ đơn giản, tránh jargon kỹ thuật khi có thể.

## Kiến trúc kỹ thuật

- **Web app thuần client-side**, deploy lên **Vercel**.
- **Không có backend, không có database.** Toàn bộ state lưu trong memory (React state) + localStorage để persist qua refresh.
- Seed data được hardcode sẵn, reset được về trạng thái ban đầu.
- Stack: **Next.js + TypeScript + Tailwind CSS**.
- Ngôn ngữ giao diện: **Tiếng Việt**.

## Data thực tế

Thư mục `Data/` chứa 6 file Excel mà khách hàng đang thực sự sử dụng để vận hành kho:

```
Data/
├── BBXX 2026.xlsm                        # Biên bản xuất xưởng
├── Kho linh kiện động cơ PASSION, at royal 2026.xlsx
├── Kho linh kiện động cơ xe ga 2026.xlsx
├── Kho linh kiện động cơ xe số 2026.xlsx
├── Kho linh kiện sản xuất V38 PRO, VIRAL PRO, V68-3, ROYAL, VIRAL S2 2026.xlsx
└── Nhựa Si.xlsx
```

Các file này sẽ được phân tích trong session riêng để trích xuất seed data (danh sách vật liệu, mẫu xe, định mức). **Không đọc hoặc xử lý các file này trừ khi được yêu cầu cụ thể.**

## Scope & Thứ tự triển khai

### Tier 1 — Must Work (pain point demo, phải hoạt động thật)

Đây là phần khách hàng sẽ tự tay thao tác. Phải mượt, data phải realistic.

#### Bước 1: Data Model + Item Master

- Định nghĩa data model cho toàn bộ app (xem mục Data Model bên dưới).
- Hardcode seed data realistic (dựa trên file Excel nếu đã phân tích, hoặc dữ liệu mẫu ngành xe máy điện).
- UI quản lý Item Master: danh sách vật liệu, thêm/sửa/xóa, tìm kiếm, phân loại theo nhóm.

#### Bước 2: Production BOM

- CRUD cho Production BOM (BOM sản xuất theo mẫu xe).
- Mỗi BOM có version. Khi sửa BOM → tạo version mới, giữ lại version cũ.
- Hiển thị: chọn mẫu xe → thấy danh sách vật liệu + định mức.

#### Bước 3: Current Stock + Goods Receipt (Nhập kho)

- Xem tồn kho hiện tại theo SKU: mã, tên, đơn vị, tồn, nhóm.
- Nhập kho theo Purchase BOM: chọn BOM → xác nhận số lượng từng item → cập nhật tồn.
- Nhập kho item lẻ: chọn vật liệu + số lượng → cập nhật tồn.
- Mỗi lần nhập tạo 1 record trong Stock Movement Log.

#### Bước 4: Goods Issue (Xuất kho) + Movement Log

- Xuất kho theo Production BOM: chọn mẫu xe + số lượng xe → hệ thống tính vật liệu cần → xác nhận → trừ tồn.
- Xuất kho item lẻ.
- Stock Movement Log: lịch sử toàn bộ nhập/xuất/điều chỉnh, ai, lúc nào, bao nhiêu, lý do.

#### Bước 5: Production Capacity Calculator ⭐

Đây là "wow moment" của demo. Khách chọn mẫu xe → hệ thống trả lời ngay:
- Còn sản xuất được tối đa **N chiếc**.
- Bottleneck: vật liệu Y (còn Z cái, cần W cái/xe).
- Bảng chi tiết: từng vật liệu, tồn, cần/xe, đủ cho bao nhiêu xe.

#### Bước 6: Purchase BOM + Nhập kho theo Purchase BOM

- CRUD cho Purchase BOM (danh sách vật liệu theo đơn mua từ nhà cung cấp).
- Liên kết với luồng nhập kho ở Bước 3.

### Tier 2 — Should Work (chứng minh hệ thống nghiêm túc)

#### Bước 7: Stock Adjustment

- Điều chỉnh tồn kho thủ công + bắt buộc nhập lý do.
- Ghi vào Movement Log với type = "adjustment".
- Dùng cho kiểm kê (stocktake) và khởi tạo tồn đầu kỳ.

#### Bước 8: UoM Conversion

- Mỗi item có thể có nhiều đơn vị tính với tỷ lệ chuyển đổi (1 cuộn = 50m, 1 hộp = 100 cái).
- BOM dùng đơn vị sản xuất, nhập kho có thể dùng đơn vị mua.

#### Bước 9: Min Stock Alert

- Mỗi item có ngưỡng tồn tối thiểu (reorder point).
- Khi tồn dưới ngưỡng → hiển thị cảnh báo trên dashboard và trong danh sách tồn kho.

#### Bước 10: Dashboard tổng quan

- Tổng số SKU, tổng lượt nhập/xuất gần đây.
- Danh sách cảnh báo tồn thấp.
- Recent movements.
- Production capacity overview (tất cả mẫu xe, mỗi mẫu còn sản xuất được bao nhiêu).

### Tier 3 — UI Only (để khách hình dung, chưa cần hoạt động thật)

#### Mobile Worker Interface

- Giao diện nhận phiếu xuất trên mobile.
- Hiển thị danh sách vật liệu cần lấy, tick từng item khi lấy xong.
- Chỉ cần UI tĩnh với sample data, không cần sync real-time.

#### OCR Scan Hóa đơn

- Giao diện chụp ảnh hóa đơn/bảng vật liệu.
- Show kết quả OCR mẫu (hardcode) hoặc tích hợp API OCR nếu kịp.
- Mục đích: demo khả năng scan đơn mua → tạo/cập nhật Purchase BOM.

## Data Model

```
Item {
  id: string (SKU code, e.g. "M001")
  name: string
  unit: string (đơn vị chính: "cái", "mét", "kg", "cuộn", "bộ", "tấm", "lít")
  category: string ("Ốc vít", "Khung sườn", "Động cơ", "Pin/Ắc quy", "Dây điện", "Nhựa", "Phụ kiện", "Khác")
  minStock: number | null (ngưỡng cảnh báo tồn tối thiểu)
  uomConversions: { unit: string, factor: number }[] (e.g. [{ unit: "cuộn", factor: 50 }] nghĩa là 1 cuộn = 50 đơn vị chính)
}

BOM {
  id: string
  type: "purchase" | "production"
  name: string (tên đơn mua hoặc tên mẫu xe)
  description: string
  currentVersion: number
  versions: BOMVersion[]
}

BOMVersion {
  version: number
  createdAt: timestamp
  note: string (lý do thay đổi)
  lines: BOMLine[]
}

BOMLine {
  itemId: string (reference to Item)
  quantity: number (định mức cho 1 đơn vị, e.g. 4 ốc M6 cho 1 xe)
  unit: string (đơn vị sử dụng trong BOM, có thể khác đơn vị chính)
  note: string
}

StockMovement {
  id: string
  itemId: string
  type: "receipt" | "issue" | "adjustment"
  quantity: number (dương = nhập, âm = xuất/điều chỉnh giảm)
  bomId: string | null (nếu nhập/xuất theo BOM)
  bomVersion: number | null
  reason: string
  createdAt: timestamp
  createdBy: string
}

// Tồn kho = SUM(StockMovement.quantity) GROUP BY itemId
// Không lưu tồn kho riêng — luôn tính từ movements để đảm bảo consistency.
```

## Quy tắc chung

- **Ngôn ngữ giao diện**: Tiếng Việt. Biến, code, comments bằng tiếng Anh.
- **Không over-engineer**: Đây là demo, không cần authentication, authorization, error boundary phức tạp, hoặc test.
- **Seed data phải realistic**: Dùng tên vật liệu thật (ốc M6, bu lông M10, khung sườn, motor, pin lithium...), mẫu xe thật của Victoria (PASSION, ROYAL, V38 PRO, VIRAL PRO, V68-3, VIRAL S2), và số lượng hợp lý.
- **Mỗi action phải phản hồi rõ ràng**: toast/notification khi nhập/xuất thành công, confirm dialog khi xuất kho hoặc xóa.
- **Responsive**: Chủ yếu demo trên laptop, nhưng Tier 3 mobile UI cần hiển thị tốt trên điện thoại.
- **Reset data**: Có nút reset toàn bộ data về seed data ban đầu (quan trọng cho demo lặp lại).