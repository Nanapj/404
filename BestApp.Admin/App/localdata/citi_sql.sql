DECLARE @json NVARCHAR(MAX);
SET @json = N'[
   {
      "name":"An Giang",
      "slug":"an-giang",
      "type":"tinh",
      "name_with_type":"Tỉnh An Giang",
      "code":"89",
      "ID":"e353fda4-ae9a-4336-a53a-4173072c2f9c"
   },
   {
      "name":"Kon Tum",
      "slug":"kon-tum",
      "type":"tinh",
      "name_with_type":"Tỉnh Kon Tum",
      "code":"62",
      "ID":"adbb29a5-2d79-4534-82b7-3fbe70d0ff1c"
   },
   {
      "name":"Đắk Nông",
      "slug":"dak-nong",
      "type":"tinh",
      "name_with_type":"Tỉnh Đắk Nông",
      "code":"67",
      "ID":"13c69ae5-3cff-4fbf-8f8e-951ae81c0c66"
   },
   {
      "name":"Sóc Trăng",
      "slug":"soc-trang",
      "type":"tinh",
      "name_with_type":"Tỉnh Sóc Trăng",
      "code":"94",
      "ID":"c11c0cf0-4db6-4936-b03c-927a80de2da9"
   },
   {
      "name":"Bình Phước",
      "slug":"binh-phuoc",
      "type":"tinh",
      "name_with_type":"Tỉnh Bình Phước",
      "code":"70",
      "ID":"0abd769d-8cf8-4a86-b647-edcc66842f0e"
   },
   {
      "name":"Hưng Yên",
      "slug":"hung-yen",
      "type":"tinh",
      "name_with_type":"Tỉnh Hưng Yên",
      "code":"33",
      "ID":"a2f82c4b-5891-4547-98d4-227086506f60"
   },
   {
      "name":"Thanh Hóa",
      "slug":"thanh-hoa",
      "type":"tinh",
      "name_with_type":"Tỉnh Thanh Hóa",
      "code":"38",
      "ID":"3529b70f-a012-421c-b874-089c10b64607"
   },
   {
      "name":"Quảng Trị",
      "slug":"quang-tri",
      "type":"tinh",
      "name_with_type":"Tỉnh Quảng Trị",
      "code":"45",
      "ID":"f21978dd-9a51-401c-b4ad-019343b70548"
   },
   {
      "name":"Tuyên Quang",
      "slug":"tuyen-quang",
      "type":"tinh",
      "name_with_type":"Tỉnh Tuyên Quang",
      "code":"08",
      "ID":"09e1b794-ddf3-406a-a1f6-0fc8ac6377f1"
   },
   {
      "name":"Quảng Ngãi",
      "slug":"quang-ngai",
      "type":"tinh",
      "name_with_type":"Tỉnh Quảng Ngãi",
      "code":"51",
      "ID":"f6822940-0b83-448e-a8e9-85aed5511324"
   },
   {
      "name":"Hà Nội",
      "slug":"ha-noi",
      "type":"thanh-pho",
      "name_with_type":"Thành phố Hà Nội",
      "code":"01",
      "ID":"0503a174-961a-4aca-8a61-a652a11a128c"
   },
   {
      "name":"Lào Cai",
      "slug":"lao-cai",
      "type":"tinh",
      "name_with_type":"Tỉnh Lào Cai",
      "code":"10",
      "ID":"5fd0cb30-2777-40f2-95bb-37e0e18138fb"
   },
   {
      "name":"Vĩnh Long",
      "slug":"vinh-long",
      "type":"tinh",
      "name_with_type":"Tỉnh Vĩnh Long",
      "code":"86",
      "ID":"2ce234d8-7d56-4b70-bcd3-9fe70173029a"
   },
   {
      "name":"Lâm Đồng",
      "slug":"lam-dong",
      "type":"tinh",
      "name_with_type":"Tỉnh Lâm Đồng",
      "code":"68",
      "ID":"352cb07e-a5f1-447a-9719-163b525c7fb3"
   },
   {
      "name":"Bình Định",
      "slug":"binh-dinh",
      "type":"tinh",
      "name_with_type":"Tỉnh Bình Định",
      "code":"52",
      "ID":"4d2966c2-9c81-4cdc-9e1e-53f7f2a23e95"
   },
   {
      "name":"Nghệ An",
      "slug":"nghe-an",
      "type":"tinh",
      "name_with_type":"Tỉnh Nghệ An",
      "code":"40",
      "ID":"abf5c001-c52a-46be-9497-07200c9c2ed0"
   },
   {
      "name":"Kiên Giang",
      "slug":"kien-giang",
      "type":"tinh",
      "name_with_type":"Tỉnh Kiên Giang",
      "code":"91",
      "ID":"f1eb6ab2-4f94-4ab3-841b-b49e6d2082c0"
   },
   {
      "name":"Hà Giang",
      "slug":"ha-giang",
      "type":"tinh",
      "name_with_type":"Tỉnh Hà Giang",
      "code":"02",
      "ID":"8e1eed17-ca7f-4cf0-84f8-c3ba2f22727b"
   },
   {
      "name":"Phú Yên",
      "slug":"phu-yen",
      "type":"tinh",
      "name_with_type":"Tỉnh Phú Yên",
      "code":"54",
      "ID":"4dd56361-216c-4ffa-b529-abc28afd6e90"
   },
   {
      "name":"Lạng Sơn",
      "slug":"lang-son",
      "type":"tinh",
      "name_with_type":"Tỉnh Lạng Sơn",
      "code":"20",
      "ID":"645ddf05-6216-48af-b83f-8995d56089f6"
   },
   {
      "name":"Đà Nẵng",
      "slug":"da-nang",
      "type":"thanh-pho",
      "name_with_type":"Thành phố Đà Nẵng",
      "code":"48",
      "ID":"0d271fc6-2e07-43c2-9509-1eba79453908"
   },
   {
      "name":"Sơn La",
      "slug":"son-la",
      "type":"tinh",
      "name_with_type":"Tỉnh Sơn La",
      "code":"14",
      "ID":"a8d7fabd-5e03-4ab6-88b0-57c89f596a12"
   },
   {
      "name":"Tây Ninh",
      "slug":"tay-ninh",
      "type":"tinh",
      "name_with_type":"Tỉnh Tây Ninh",
      "code":"72",
      "ID":"09f0c7b8-4db6-45df-b314-11f7396f70bd"
   },
   {
      "name":"Nam Định",
      "slug":"nam-dinh",
      "type":"tinh",
      "name_with_type":"Tỉnh Nam Định",
      "code":"36",
      "ID":"05512aca-b10b-40e6-8f71-267a0efb731e"
   },
   {
      "name":"Lai Châu",
      "slug":"lai-chau",
      "type":"tinh",
      "name_with_type":"Tỉnh Lai Châu",
      "code":"12",
      "ID":"258961f3-214a-4790-b694-ef13ae18a806"
   },
   {
      "name":"Bến Tre",
      "slug":"ben-tre",
      "type":"tinh",
      "name_with_type":"Tỉnh Bến Tre",
      "code":"83",
      "ID":"3ab04e52-80ef-42b2-b1e0-e2af8bb7e4cc"
   },
   {
      "name":"Khánh Hòa",
      "slug":"khanh-hoa",
      "type":"tinh",
      "name_with_type":"Tỉnh Khánh Hòa",
      "code":"56",
      "ID":"e73e9759-5aa7-43e6-8389-cce2c7d0ea0c"
   },
   {
      "name":"Bình Thuận",
      "slug":"binh-thuan",
      "type":"tinh",
      "name_with_type":"Tỉnh Bình Thuận",
      "code":"60",
      "ID":"cf605546-c76a-412b-bc41-f1a58680c7ea"
   },
   {
      "name":"Cao Bằng",
      "slug":"cao-bang",
      "type":"tinh",
      "name_with_type":"Tỉnh Cao Bằng",
      "code":"04",
      "ID":"e24945da-b5e8-4f11-9554-affb8692b911"
   },
   {
      "name":"Hải Phòng",
      "slug":"hai-phong",
      "type":"thanh-pho",
      "name_with_type":"Thành phố Hải Phòng",
      "code":"31",
      "ID":"1c0e28ce-d107-4aa6-a75d-a441a470a5c4"
   },
   {
      "name":"Ninh Bình",
      "slug":"ninh-binh",
      "type":"tinh",
      "name_with_type":"Tỉnh Ninh Bình",
      "code":"37",
      "ID":"83e15a09-ed3e-4ac3-b129-a183c80fa4a5"
   },
   {
      "name":"Yên Bái",
      "slug":"yen-bai",
      "type":"tinh",
      "name_with_type":"Tỉnh Yên Bái",
      "code":"15",
      "ID":"4489622b-1d23-48b0-905a-0757cdbdf84b"
   },
   {
      "name":"Gia Lai",
      "slug":"gia-lai",
      "type":"tinh",
      "name_with_type":"Tỉnh Gia Lai",
      "code":"64",
      "ID":"98659676-ed9b-4cba-b22f-ae609d5cfe2d"
   },
   {
      "name":"Hoà Bình",
      "slug":"hoa-binh",
      "type":"tinh",
      "name_with_type":"Tỉnh Hoà Bình",
      "code":"17",
      "ID":"013194d9-8322-45c3-b465-78ab5e184b64"
   },
   {
      "name":"Bà Rịa - Vũng Tàu",
      "slug":"ba-ria-vung-tau",
      "type":"tinh",
      "name_with_type":"Tỉnh Bà Rịa - Vũng Tàu",
      "code":"77",
      "ID":"07f8d051-a385-4770-acbd-4670b9cc0365"
   },
   {
      "name":"Cà Mau",
      "slug":"ca-mau",
      "type":"tinh",
      "name_with_type":"Tỉnh Cà Mau",
      "code":"96",
      "ID":"abef7820-1012-421f-991b-4f4ef51f8a80"
   },
   {
      "name":"Bình Dương",
      "slug":"binh-duong",
      "type":"tinh",
      "name_with_type":"Tỉnh Bình Dương",
      "code":"74",
      "ID":"ea2eba19-677e-4a94-9f61-7e0488924730"
   },
   {
      "name":"Cần Thơ",
      "slug":"can-tho",
      "type":"thanh-pho",
      "name_with_type":"Thành phố Cần Thơ",
      "code":"92",
      "ID":"105dd46a-6d2a-4985-8212-29cb5a975bc1"
   },
   {
      "name":"Thừa Thiên Huế",
      "slug":"thua-thien-hue",
      "type":"tinh",
      "name_with_type":"Tỉnh Thừa Thiên Huế",
      "code":"46",
      "ID":"6a1b2b8c-f22f-4e67-9fbc-1709850bff27"
   },
   {
      "name":"Đồng Nai",
      "slug":"dong-nai",
      "type":"tinh",
      "name_with_type":"Tỉnh Đồng Nai",
      "code":"75",
      "ID":"23ce9abc-9d5a-400c-a0f7-caa2e0a2224b"
   },
   {
      "name":"Tiền Giang",
      "slug":"tien-giang",
      "type":"tinh",
      "name_with_type":"Tỉnh Tiền Giang",
      "code":"82",
      "ID":"08c7a48c-5703-4f0a-adc9-3906fbb4a369"
   },
   {
      "name":"Điện Biên",
      "slug":"dien-bien",
      "type":"tinh",
      "name_with_type":"Tỉnh Điện Biên",
      "code":"11",
      "ID":"54cf32bc-76c7-4682-a006-68a29b888807"
   },
   {
      "name":"Vĩnh Phúc",
      "slug":"vinh-phuc",
      "type":"tinh",
      "name_with_type":"Tỉnh Vĩnh Phúc",
      "code":"26",
      "ID":"dd8543ab-b205-457a-889c-e4e4760a97c3"
   },
   {
      "name":"Quảng Nam",
      "slug":"quang-nam",
      "type":"tinh",
      "name_with_type":"Tỉnh Quảng Nam",
      "code":"49",
      "ID":"21c047a2-9bcd-4a21-8f1c-384bbf18eaa4"
   },
   {
      "name":"Đắk Lắk",
      "slug":"dak-lak",
      "type":"tinh",
      "name_with_type":"Tỉnh Đắk Lắk",
      "code":"66",
      "ID":"41eeca8c-7121-4563-82cc-a61fa578bf55"
   },
   {
      "name":"Thái Nguyên",
      "slug":"thai-nguyen",
      "type":"tinh",
      "name_with_type":"Tỉnh Thái Nguyên",
      "code":"19",
      "ID":"41f4f484-0ae3-4a1d-b555-a827362e03e3"
   },
   {
      "name":"Hải Dương",
      "slug":"hai-duong",
      "type":"tinh",
      "name_with_type":"Tỉnh Hải Dương",
      "code":"30",
      "ID":"6fe09abf-4d87-41d5-9099-aa0aa5c0604b"
   },
   {
      "name":"Bạc Liêu",
      "slug":"bac-lieu",
      "type":"tinh",
      "name_with_type":"Tỉnh Bạc Liêu",
      "code":"95",
      "ID":"bb0df513-d2e1-4d81-b561-72f79d8673c2"
   },
   {
      "name":"Trà Vinh",
      "slug":"tra-vinh",
      "type":"tinh",
      "name_with_type":"Tỉnh Trà Vinh",
      "code":"84",
      "ID":"4c32685c-5f42-4c3f-b613-ddd38d8d4c92"
   },
   {
      "name":"Thái Bình",
      "slug":"thai-binh",
      "type":"tinh",
      "name_with_type":"Tỉnh Thái Bình",
      "code":"34",
      "ID":"83a388cc-1261-4e2d-a98b-2b9e84c0213a"
   },
   {
      "name":"Hà Tĩnh",
      "slug":"ha-tinh",
      "type":"tinh",
      "name_with_type":"Tỉnh Hà Tĩnh",
      "code":"42",
      "ID":"479af156-c2e6-4f75-a785-f6d321c66ee3"
   },
   {
      "name":"Ninh Thuận",
      "slug":"ninh-thuan",
      "type":"tinh",
      "name_with_type":"Tỉnh Ninh Thuận",
      "code":"58",
      "ID":"e7290e20-4e25-4a9f-a6af-3f64c86205e4"
   },
   {
      "name":"Đồng Tháp",
      "slug":"dong-thap",
      "type":"tinh",
      "name_with_type":"Tỉnh Đồng Tháp",
      "code":"87",
      "ID":"dda05c8a-4f38-4636-805a-b50876f0112a"
   },
   {
      "name":"Long An",
      "slug":"long-an",
      "type":"tinh",
      "name_with_type":"Tỉnh Long An",
      "code":"80",
      "ID":"a33aae2e-13e2-4c12-8cbe-039b4256e1f2"
   },
   {
      "name":"Hậu Giang",
      "slug":"hau-giang",
      "type":"tinh",
      "name_with_type":"Tỉnh Hậu Giang",
      "code":"93",
      "ID":"246dbd7f-aefd-4807-89bf-d1147965f990"
   },
   {
      "name":"Quảng Ninh",
      "slug":"quang-ninh",
      "type":"tinh",
      "name_with_type":"Tỉnh Quảng Ninh",
      "code":"22",
      "ID":"5329163c-6387-4958-8898-d40feb60630b"
   },
   {
      "name":"Phú Thọ",
      "slug":"phu-tho",
      "type":"tinh",
      "name_with_type":"Tỉnh Phú Thọ",
      "code":"25",
      "ID":"4321a7f3-c2eb-48a8-b092-1fac8370913d"
   },
   {
      "name":"Quảng Bình",
      "slug":"quang-binh",
      "type":"tinh",
      "name_with_type":"Tỉnh Quảng Bình",
      "code":"44",
      "ID":"63f40542-dd8c-4184-abf5-1d073a179e4d"
   },
   {
      "name":"Hồ Chí Minh",
      "slug":"ho-chi-minh",
      "type":"thanh-pho",
      "name_with_type":"Thành phố Hồ Chí Minh",
      "code":"79",
      "ID":"fa2f1587-286e-42c6-89f2-959ed8a9a636"
   },
   {
      "name":"Hà Nam",
      "slug":"ha-nam",
      "type":"tinh",
      "name_with_type":"Tỉnh Hà Nam",
      "code":"35",
      "ID":"60205586-c40b-4967-bbaf-dea92f4cbd69"
   },
   {
      "name":"Bắc Ninh",
      "slug":"bac-ninh",
      "type":"tinh",
      "name_with_type":"Tỉnh Bắc Ninh",
      "code":"27",
      "ID":"d674018c-0124-444b-9354-4dea9dc26120"
   },
   {
      "name":"Bắc Giang",
      "slug":"bac-giang",
      "type":"tinh",
      "name_with_type":"Tỉnh Bắc Giang",
      "code":"24",
      "ID":"1510beab-5f05-478d-a4d7-6652a39110b1"
   },
   {
      "name":"Bắc Kạn",
      "slug":"bac-kan",
      "type":"tinh",
      "name_with_type":"Tỉnh Bắc Kạn",
      "code":"06",
      "ID":"a9581170-d768-4cc2-b0d1-51e3633443e4"
   }
]';

INSERT INTO Cities(Id,[name],slug,[type],name_with_type,code)
SELECT *
FROM OPENJSON (@json, N'$')
  WITH (
	Id UNIQUEIDENTIFIER N'$.ID',
    [name] NVARCHAR(MAX) N'$.name',
    slug NVARCHAR(MAX) N'$.slug',
    [type] NVARCHAR(MAX) N'$.type',
    name_with_type NVARCHAR(MAX) N'$.name_with_type',
	code NVARCHAR(MAX) N'$.code'
);



-- SELECT Cities.*
-- FROM OPENJSON (@json, N'$')
--   WITH (
--     [name] NVARCHAR(MAX) N'$.name',
--     slug NVARCHAR(MAX) N'$.slug',
--     [type] NVARCHAR(MAX) N'$.type',
--     name_with_type NVARCHAR(MAX) N'$.name_with_type',
-- 	code NVARCHAR(MAX) N'$.code'
-- ) AS Cities;
-- var mainInfo = $http.get('/App/locationdata/wards.json').success(function(response) {
--     return response.data;
-- }).then(response => {
--     var objects = [];
--     response.data.forEach(element => {
--         element["ID"] = generateUUID();
--         console.log(element);
--         objects.push(element);
--     });
--     var jsonse = JSON.stringify(objects);
--     var blob = new Blob([jsonse], {
--     type: "application/json"
--     });
--     $scope.filename = $scope.filename || "my_json";
--     saveAs(blob, $scope.filename + ".json");});
--     console.log(mainInfo);
-- var mainInfo = $http.get('/App/locationdata/wards.json').success(function(response) {
--      return response.data;
--  }).then(response => {
--      console.log(response);
--  });