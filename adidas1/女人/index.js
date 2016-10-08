/**
 * Created by 乖宝宝 on 2016/8/28.
 */
window.onload = function () {
    var line1 = document.getElementById("line1");
    var line2 = document.getElementById("line2");
    var line3 = document.getElementById("line3");
    var line4 = document.getElementById("line4");

    var list1 = document.getElementById("list1");
    var list2 = document.getElementById("list2");
    var list3 = document.getElementById("list3");

    var flag = true;
    //main部分左边盒子的下拉列表
    line1.onclick = function () {
        if (flag) {
            line1.innerHTML = "-";
            list1.style.display = "block";
            flag = false;
        } else {
            line1.innerHTML = "+";
            list1.style.display = "none";
            flag = true;
        }
    };

    line2.onclick = function () {
        if (flag) {
            line2.innerHTML = "-";
            list2.style.display = "block";
            flag = false;
        } else {
            line2.innerHTML = "+";
            list2.style.display = "none";
            flag = true;
        }
    };

    line3.onclick = function () {
        if (flag) {
            line3.innerHTML = "-";
            list3.style.display = "block";
            flag = false;
        } else {
            line3.innerHTML = "+";
            list3.style.display = "none";
            flag = true;
        }

    };

    //main部分的轮播图
    var main = document.getElementById("main");
    var main_bg = document.getElementById("main_bg");
    var lis = main_bg.children;
    var sj = document.getElementById("sj");
    var left = document.getElementById("left");
    var right = document.getElementById("right");


    var fd = document.getElementById("fd");

    //移入显示
    main.onmouseover = function () {
        sj.style.display = "block";
        fd.style.display = "block";
    }

    //移出消失
    main.onmouseout = function () {
        sj.style.display = "none";
        fd.style.display = "none";
    }

    //克隆假的第一张
    var firstPic = lis[0].cloneNode(true);
    main_bg.appendChild(firstPic);

    var pic = 0;
    var imgWid = main.offsetWidth;

    //点击右按钮
    right.onclick = function () {
        //右边停止的条件
        if (pic == lis.length - 1) {
            main_bg.style.left = 0 + "px";
            pic = 0;
        }
        pic++;
        animate(main_bg, -pic * imgWid);
    }

    //左盒子点击事件
    left.onclick = function () {
        //左边停止的条件
        if (pic == 0) {
            main_bg.style.left = - (lis.length - 1) * imgWid + "px";
            pic = lis.length - 1;
        }
        pic--;
        animate(main_bg, -pic * imgWid);
    }




    //鼠标移入白色边框显示
    var change_fd = document.getElementById("change_fd");
    var shoe = document.getElementById("shoe");
    var cloth_t = document.getElementById("cloth_t");
    var cloth_fd = document.getElementById("cloth_fd");
    var phone_fd = document.getElementById("phone_fd");
    var phone_pic = document.getElementById("phone_pic");

    shoe.onmouseover = function () {
        change_fd.style.display = "block";
    };

    shoe.onmouseout = function () {
        change_fd.style.display = "none";
    };

    cloth_t.onmouseover = function () {
        cloth_fd.style.display = "block";
    };

    cloth_t.onmouseout = function () {
        cloth_fd.style.display = "none";
    };

    phone_pic.onmouseover = function () {
        phone_fd.style.display = "block";
    };

    phone_pic.onmouseout = function () {
        phone_fd.style.display = "none";
    };

    //移入按钮，下拉盒子显示
    var btn1 = document.getElementById("btn1");
    var btn2 = document.getElementById("btn2");
    var btn3 = document.getElementById("btn3");
    var btn4 = document.getElementById("btn4");
    var li1 = document.getElementById("li1");
    var li2 = document.getElementById("li2");
    var li3 = document.getElementById("li3");
    var li4 = document.getElementById("li4");
    var ht1 = document.getElementById("ht1");
    var ht2 = document.getElementById("ht2");
    var ht3 = document.getElementById("ht3");
    var ht4 = document.getElementById("ht4");
    var type_f = document.getElementById("type_f");
    var type_1s = type_f.children;
    var type_list1 = document.getElementById("type_list1");
    var type_list2 = document.getElementById("type_list2");
    var type_list3 = document.getElementById("type_list3");
    var type_list4 = document.getElementById("type_list4");

    for (var i = 1; i < 5; i++) {
        type_1s[i].style.left = 265 * i - 80 + "px";
    }

    btn1.onmouseover = function () {
        type_list1.style.height = '250px';
        type_list1.style.backgroundColor = '#fff';
        li1.style.height = "300px";
        li1.style.paddingLeft = "30px";
        li1.style.paddingTop = "10px";
        li1.style.boxShadow = "0 0 5px 3px #ccc";
        ht1.style.backgroundColor = "#000";
        btn1.style.display = 'none';
    }

    type_list1.onmouseout = function () {
        type_list1.style.height = '90px';
        ht1.style.backgroundColor = "#EAEAEA";
        btn1.style.display = 'block';
        li1.style.paddingLeft = "0px";
        li1.style.paddingTop = "0px";
        li1.style.boxShadow = "";
        li1.style.height = "195px";
    }

    btn2.onmouseover = function () {
        type_list2.style.height = '200px';
        type_list2.style.backgroundColor = '#fff';
        li2.style.height = "250px";
        li2.style.paddingLeft = "30px";
        li2.style.paddingTop = "10px";
        li2.style.boxShadow = "0 0 5px 3px #ccc";
        ht2.style.backgroundColor = "#000";
        btn2.style.display = 'none';
    }

    type_list2.onmouseout = function () {
        type_list2.style.height = '90px';
        ht2.style.backgroundColor = "#EAEAEA";
        btn2.style.display = 'block';
        li2.style.paddingLeft = "0px";
        li2.style.paddingTop = "0px";
        li2.style.boxShadow = "";
        li2.style.height = "195px";
    }

    btn3.onmouseover = function () {
        type_list3.style.height = '200px';
        type_list3.style.backgroundColor = '#fff';
        li3.style.height = "250px";
        li3.style.paddingLeft = "30px";
        li3.style.paddingTop = "10px";
        li3.style.boxShadow = "0 0 5px 3px #ccc";
        ht3.style.backgroundColor = "#000";
        btn3.style.display = 'none';
    }

    type_list3.onmouseout = function () {
        type_list3.style.height = '90px';
        ht3.style.backgroundColor = "#EAEAEA";
        btn3.style.display = 'block';
        li3.style.paddingLeft = "0px";
        li3.style.paddingTop = "0px";
        li3.style.boxShadow = "";
        li3.style.height = "195px";
    }

    btn4.onmouseover = function () {
        type_list4.style.height = '200px';
        type_list4.style.backgroundColor = '#fff';
        li4.style.height = "250px";
        li4.style.paddingLeft = "30px";
        li4.style.paddingTop = "10px";
        li4.style.boxShadow = "0 0 5px 3px #ccc";
        ht4.style.backgroundColor = "#000";
        btn4.style.display = 'none';
    }

    type_list4.onmouseout = function () {
        type_list4.style.height = '90px';
        ht4.style.backgroundColor = "#EAEAEA";
        btn4.style.display = 'block';
        li4.style.paddingLeft = "0px";
        li4.style.paddingTop = "0px";
        li4.style.boxShadow = "";
        li4.style.height = "195px";
    }









}
