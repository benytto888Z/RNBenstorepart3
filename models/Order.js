import moment from 'moment';
import localization from 'moment/locale/fr';
moment.updateLocale('fr', localization);

class Order{
    constructor(id,items,totalAmount,date){
        this.id = id;
        this.items= items;
        this.totalAmount=totalAmount;
        this.date = date;
    }

    get readableDate(){
       /* return this.date.toLocaleDateString(('fr-FR'),{
            year:'numeric',
            month:'long',
            day:'numeric',
            hour:'2-digit',
            minute:'2-digit'
        })*/

       return moment(this.date).format('Do MMMM YYYY,hh:mm')
    }
}

export default Order;