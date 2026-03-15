# best-hotel-bdx-sud

## Main Pages / Nav items
- Home (/index.html)
- Rooms (/rooms.html)
- Services (/services.html)
- About (/about.html)

## Tasks
Các em giúp anh thiết kế 2 trang **Services** và **About** (anh sẽ làm trang **Rooms**)

## Yêu cầu 
- Design dựa trên template sẵn có, các component thêm vào trang phải cùng ngôn ngữ thiết kế
- Mỗi trang cần giữ format tiêu đề như hiện giờ (tham khảo trang rooms.html, line 159-165) ![alt](./tmp/{B0D2D2EC-76BB-4682-BFEE-3E4996AC9F9E}.png)
- Cần đảm bảo responsive design, kiểm tra giao diện trên mọi kích cỡ màn hình, đảm bảo không bị lệch, tràn, ...
- Màu chủ đạo (accent colors) dùng cho các nút bấm, hover, ... được định nghĩa sẵn trong style.css : brand-color, brand-color-light

## Hướng dẫn 
- Hiện trang chủ đang có 2 ngôn ngữ (en/fr), các em cứ tập trung vào en, không cần chỉnh sửa fr.
- Ngoài file index.html (đã gần như hoàn thiện), các file còn lại đều là template sẵn có, chưa chỉnh sửa. 
- Tốt nhất là duplicate trang index.html (để giữ những thay đổi của anh trên navbar, footer,...) và chỉnh sửa các sections cho từng trang mới 
- Có thể copy paste từng section từ các trang template hoặc tự tìm các component/thiết kế mà các em thấy phù hợp

### Tham khảo 

#### A. Booking của khách sạn

https://www.booking.com/hotel/fr/best-bordeaux-sud.html

Mọi thông tin (serices, rooms, địa chỉ, hình ảnh,...) các em lấy từ trang Booking này.

#### B. Khách sạn khác cùng chủ 
https://en.hotel-formuleclub.fr/ 

Trang này chỉ để tham khảo, chủ yếu xem họ để thông tin gì trong từng trang. 

Cá nhân anh thấy trang này chưa tốt: 
- thiết kế tuy hiện đại nhưng không phù hợp cho khách sạn, không bắt mắt 
- nội dung giữa các trang hay bị trùng lặp

#### C. Khách sạn không liên quan 
https://www.charingcrosshotel.com/en/services-equipment/

Chỉ là random 1 trang khách sạn ở Pháp để tham khảo

## Yêu cầu cho từng trang

### Services
Chỉ cần 1 section duy nhất, các em tự đề xuất bố cục trình bày

Tham khảo:
- Homepage > Section "What we do" (Services nổi bật)
- Tất cả các services trên Booking của ks

### About
- địa chỉ, sdt, fax, email, website, reception hours
- Location (how to access): nhúng google map
- Không cần contact form 
- Template _contact.html khá ổn để dùng lại.

Tham khảo:
- https://en.hotel-formuleclub.fr/contact-access
- https://www.charingcrosshotel.com/en/contact-us/

