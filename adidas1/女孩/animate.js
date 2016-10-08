/**
 * Created by yoyo on 2016-08-19.
 */
/**
 * ������Ԫ���ƶ���ָ��λ��
 * @param tag Ҫ�����˶���Ԫ�أ���ȡ��ı�ǩ
 * @param target Ҫ�˶����ĸ�λ�ã���ֵ
 */
function animate(tag, target) {
    //2 Ϊ�˷�ֹ��δ�����ʱ������ȥ����ɵ�
    clearInterval(tag.timer);
    tag.timer = setInterval(function () {
        //3 ��ȡbox�ĵ�ǰλ��
        var leader = tag.offsetLeft;
        //4 ���ò���
        //����leader �� target ֮��Ĺ�ϵ�ж�step������
        var step = 17;
//            if (target > leader) {
//                step = step;
//            } else {
//                step = -step;
//            }
        step = target > leader ? step : -step;

        //5 �жϺ����Ƿ�����ƶ�
        //�����Ƿ�����˶�����target��leader֮��ľ����step֮��Ĺ�ϵ������
        if (Math.abs(target - leader) > Math.abs(step)) {
            //6 �˶���ʽ����ǰλ��(�µ�)=����ǰλ��(�ɵ�)+Ҫ�ƶ���λ��
            leader = leader + step;
            tag.style.left = leader + "px";
        } else {
            //��λ������Ϊtarget��ֵ
            tag.style.left = target + "px";
            //7 ������������������ʱ��
            clearInterval(tag.timer);
        }
       }, 17);
}
