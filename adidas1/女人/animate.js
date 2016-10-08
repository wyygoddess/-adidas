/**
 * Created by 乖宝宝 on 2016/8/20.
 */


/**
 * 让元素运动到指定位置
 * @param tag 要进行运动的元素，获取的标签
 * @param target 要运动到的位置，数值
 */
function animate(tag,target) {
    //防止多次点击造成定时器加速
    clearInterval(tag.timer);
    tag.timer = setInterval(function () {
        //获取tag的初始位置
        var leader = tag.offsetLeft;
        //设置步长
        var step = 17;
        //判断是正着走，还是返回走
        if(leader < target) {
            step = step;

        }else{
            step = -step;
        }

        //判断最后一点的步子，让盒子不再左右晃动
        if(Math.abs(target - leader) > Math.abs(step)){
            // 运动公式对象当前位置(新的)=对象当前位置(旧的)+要移动的位置
            leader = leader + step;
            tag.style.left = leader + "px";
        }else{
            //将位置设置为target的值
            tag.style.left = target + "px";
            // 如果超出条件，清除定时器
            clearInterval(tag.timer);
        }
    })
}