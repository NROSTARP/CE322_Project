(function () {

  function addEvents() {
    //เพิ่ม events สำหรับการเลือกหมวดหมู่สินค้า
    $('.products-selection a[data-tab=fruits]').click(function (e) {
      //ป้องกันการเปลี่ยนเส้นทางในหน้าใหม่
      e.preventDefault();
      //ตรวจสอบ element ที่ใช้งานอยู่ แท็บที่ใช้งานอยู่ ซ่อน - ซ่อนแท็บ
      $(".products .active").removeClass("active").addClass("hide");
      $(".fruits").removeClass("hide").addClass("active");

      //เปลี่ยนปุ่มแท็บที่ใช้งาน (li)
      $(".products-selection li.active").removeClass("active");
      $(".products-selection .fruits-tab").addClass("active");
    })

    $('.products-selection a[data-tab=vegetables]').click(function (e) {
      e.preventDefault();
      $(".products .active").removeClass("active").addClass("hide");
      $(".vegetables").removeClass("hide").addClass("active");

      //เปลี่ยนปุ่มแท็บที่ใช้งาน (li)
      $(".products-selection li.active").removeClass("active");
      $(".products-selection .vegetables-tab").addClass("active");
    })

    $('.products-selection a[data-tab=other]').click(function (e) {
      e.preventDefault();
      $(".products .active").removeClass("active").addClass("hide");
      $(".other").removeClass("hide").addClass("active");

      //เปลี่ยนปุ่มแท็บที่ใช้งาน (li)
      $(".products-selection li.active").removeClass("active");
      $(".products-selection .other-tab").addClass("active");
    })

    //เพิ่ม events สำหรับแท็บเมื่อเปลี่ยน
    $(".navigation .find").click(function (e) { //เลือกของ

      toggleField.call(this, ".products");
      changeHeaderSection.call(this, "find");
    })
    $(".navigation .weigh").click(function (e) { //ชั่งน้ำหนัก

      toggleField.call(this, ".weigh-field");
      changeHeaderSection.call(this, "weigh");
    })
    $(".navigation .buy").click(function (e) { //ชำระเงิน

      toggleField.call(this, ".bill-field");
      changeHeaderSection.call(this, "buy");
    })
    //ค้นหา card ตามที่พิมพ์หาใน input คือ Search bar
    $(".find-card").on("input", showQueryCard);

    //จับคู่ชื่อ card และคำค้นหาของผู้ใช้ ใน Search bar
    function showQueryCard() {
      var val = $(this).val().toLowerCase();//ค้นหา
      if(!val.length) { //ถ้าว่าง - แสดงทั้งหมด
        $(".card.hide").removeClass("hide");
        return;
      }
      //สร้างรูปแบบการค้นหา ด้วย RegExp
      var query = new RegExp(val);
      
      var cardsOnActiveField = $(".product-cat.active").children();//ค้นหา card ที่เลือกมาในรถเข็น
      cardsOnActiveField.each(function(i, el) {
        var element = $(el);
        //if card name !has query - hide it
        if(!query.test(element.find(".name").text().toLowerCase())) {
          element.addClass("hide");
        } else {
          element.removeClass("hide");
        }
      })
    }

    function changeHeaderSection(activateHeader) {
      $(".main-header [data-active=true]").addClass("hide").attr("data-active", "false");
      $(".header-section[data-header=" + activateHeader + "]").removeClass("hide").attr("data-active", "true");
    }

    function toggleField(activateField) {
      //เปลี่ยน active field
      $(".field[data-active=true]").addClass("hide").attr("data-active", "false");
      $(activateField).removeClass("hide").attr("data-active", "true");

      //เปลี่ยน navigation bar ที่ใช้งาน
      $(".navigation .active").removeClass("active");
      $(this).addClass("active");
    }

    //เพิ่ม events ซื้อสินค้า
    $(".card-btn").click(function (e) {
      var card = $(this).parents(".card"); //ค้นหาว่ามันคืออะไร
      //เพิ่ม img name .price .labelไปยังบิล (page)
      var product = new Product();
      product.setImage(card.find("img").attr("src"));
      product.setName(card.find(".name").text());
      product.setPrice(card.find(".price .label").text());
      //เพิ่มไปยังบิล
      bill.addProduct(product);
    })
  }

  //class ของสินค้า OOP
  function Product() {
    var name, weight, price, img, priceToPay; //private
    this.setName = function (n) {
      name = n;
    }
    this.getName = function () {
      return name;
    }
    this.setWeight = function (w) {
      weigh = w;
    }
    this.getWeight = function () {
      return weight;
    }
    this.setPrice = function (p) {
      price = p;
    }
    this.getPrice = function () {
      return price;
    }
    this.setImage = function (i) {
      img = i;
    }
    this.getImage = function () {
      return img;
    }
    this.setPriceToPay = function (p) {
      priceToPay = p;
    }
    this.getPriceToPay = function () {
      return priceToPay;
    }
  }

  //class ของบิล
  function Bill() {
    //private
    var products = [];
    var priceToPay = $(".bill [data-price]");
    var self = this;

    //เพิ่มสินค้าเพื่อชั่งน้ำหนัก
    function renderWeighField() {
      var card = buildCard(self.getProducts().slice(-1)[0]);
      //เพิ่ม สินค้าลง ใน .weigh-field
      $(".weigh-field").append(card);
    }

    //เพิ่มแท็บเพื่อซื้อ
    function renderBuyField(product) {
      //ปุ่มตกลง
      var currentCard = $(this).closest(".card");
      //ใน .weight.form-control ต้องเป็น img, ราคา, ชื่อและปุ่มยอมรับหรือยกเลิกเท่านั้น
      currentCard.find(".weight.form-control").hide();
      //เมื่อกดตกลง สินค้าเข้าหน้าชำระเงิน
      currentCard.find(".card-btn.ok").click(function() {
        //เพิ่มสินค้าในรายการหน้าชำระเงิน
        bill.makeBill(product);
        //ลบสินค้าในรายการ
        cancelBuy.call(this, product);
      })

      //ชำระเงิน
      var buyField = $(".field.buy-field");
      buyField.append(currentCard);
      changeBadge(".weigh");
      changeBadge(".buy");
    }

    function buildCard(product) {
      var card = $("<article></article>").addClass("card"); //สร้าง card

      var img = $("<figure></figure>").addClass("image"); //เพิ่มรูป
      img.append($("<img>").attr("src", product.getImage())) //เพิ่มรูป

      var content = $("<div></div>").addClass("content"); //เนื้อหา
      content.append($("<h3></h3>").addClass("name").text(product.getName()));
      var price = $("<div></div>").addClass("price"); //เนื้อหา
      price.append($("<span></span>").addClass("label label-primary").text(product.getPrice() + " : กิโลกรัม"));
      price.append($("<span></span>").addClass("label label-primary").attr("data-priceToPay", "")
        .text(calcPrice(product, 10) //น้ำหนักขั้นต่ำ 10 กรัม
          +
          " บาท"));
      content.append(price);
      //ระบุน้ำหนัก
      content.append($("<input>").addClass("weight form-control").attr({
        type: "number",
        name: "weigh",
        placeholder: "กรัม",
        // value: 10,
        min: "10",
        max: "100000"
      }).on("input", function () {
        if (!(+this.value)) {
          // alert("NaN");
        } else if ( this.value>100000) {
          alert("หน่วยเป็นกรัม ต้อง อยู่ ระหว่าง 10 กรัม ถึง 100000 กรัม เท่านั้น");
          // this.value = 10;
          // this.value<10 ||
        } else {
          var priceToPay = calcPrice(product, this.value);
          price.find(".label[data-priceToPay]").text(priceToPay + " บาท");
        }
      }));
      //ปุ่ม
      var buttons = $("<div></div>").addClass("buttons");
      buttons.append($("<button></button>").addClass("card-btn ok")
        .on("click", function() {
          renderBuyField.call(this, product);
        }).text("Ok"));
      buttons.append($("<button></button>").addClass("card-btn cancel")
        .on("click", function () {
          cancelBuy.call(this, product);
        }).text("Cancel"));
      content.append(buttons);

      card.append(img, content);
      return card;
    }

    function calcPrice(product, weigh) {
      var price = parseInt(product.getPrice());
      //คำนวณราคาที่ต้องจ่าย
      price = (price * weigh / 1000).toFixed(2); //(ราคา*น้ำหนัก/1000) ทศนิยม 2 ตำแหน่ง
      product.setPriceToPay(price); //กำหนดราคาที่ต้องจ่าย
      return price;
    }

    function cancelBuy(cancelProduct) {//events สำหรับการยกเลิก บนหน้าชำระเงินและชั่งน้ำหนัก
      //ลบ card ปัจจุบันออกจาก html
      $(this).closest(".card").remove();
      //ลบ สินค้า ปัจจุบันออกจาก array
      products.splice(products.indexOf(cancelProduct), 1);
      changeBadge(".weigh");
      changeBadge(".buy");
    }

    function changeBadge(selector) {
      //หา .badge
      var fieldSelector = (selector===".weigh") ? ".weigh-field" : ".buy-field";
      var numberOfCards = $(fieldSelector).children().length;
      if (numberOfCards > 0) {
        $(selector + " .badge").text(numberOfCards)
      } else {
        $(selector + " .badge").text("")
      }
    }

    //public
    this.addProduct = function (product) {
      //จำลอง class Product 
      if (product instanceof Product) {
        products.push(product);
        renderWeighField();
        changeBadge(".weigh");
      } else {
        alert("It is not a product");
      }
    }
    this.getProducts = function () {
      return products;
    }
    this.addPriceToPay = function (price) {
      console.log(parseFloat(priceToPay.text()));
      priceToPay.text((parseFloat(priceToPay.text()) + +price).toFixed(2)+" บาท");
    }
    
    this._billField = $(".bill .list");
    this._makeRow = function(product) {
      var row = $("<li></li>");
      row.text(product.getName().slice(0, 10) + " ต่อ กิโลกรัม ราคา : "
      + product.getPrice() + " --" + " ราคาตามน้ำหนัก : "
      + product.getPriceToPay()+ " บาท");
      return row;
    }

  }

  Bill.prototype.makeBill = function (product) {
    //เติมแถวใหม่
    var row = this._makeRow(product);
    this._billField.prepend(row);

    //เปลี่ยนยอดรวม
    this.addPriceToPay(product.getPriceToPay());
  }

  var bill = new Bill;
  addEvents();
})();