/**
 * Created by �Ա��� on 2016/8/20.
 */


/**
 * ��Ԫ���˶���ָ��λ��
 * @param tag Ҫ�����˶���Ԫ�أ���ȡ�ı�ǩ
 * @param target Ҫ�˶�����λ�ã���ֵ
 */
function animate(tag,target) {
    //��ֹ��ε����ɶ�ʱ������
    clearInterval(tag.timer);
    tag.timer = setInterval(function () {
        //��ȡtag�ĳ�ʼλ��
        var leader = tag.offsetLeft;
        //���ò���
        var step = 17;
        //�ж��������ߣ����Ƿ�����
        if(leader < target) {
            step = step;

        }else{
            step = -step;
        }

        //�ж����һ��Ĳ��ӣ��ú��Ӳ������һζ�
        if(Math.abs(target - leader) > Math.abs(step)){
            // �˶���ʽ����ǰλ��(�µ�)=����ǰλ��(�ɵ�)+Ҫ�ƶ���λ��
            leader = leader + step;
            tag.style.left = leader + "px";
        }else{
            //��λ������Ϊtarget��ֵ
            tag.style.left = target + "px";
            // ������������������ʱ��
            clearInterval(tag.timer);
        }
    })
}