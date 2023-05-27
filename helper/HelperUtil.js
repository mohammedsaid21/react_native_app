import axios from 'axios'
import Moment, { format } from 'moment';
import i18n from '../I18N';



class HelperUtil {

    formatDate = (date) => {
        return (Moment(date).format('MMMM Do YYYY, h:mm:ss a'));
    }

    getCurrencyNameLocale = (currency) => {
        if (currency === "EUR") {
            return i18n.t('currency_eur')
        }
        if (currency === "USD") {
            return i18n.t('currency_usd')

        }
        if (currency === "ILS") {
            return i18n.t('currency_ils')

        }
        if (currency === "JOD") {
            return i18n.t('currency_jod')

        }
        if (currency === "EGP") {
            return i18n.t('currency_egp')

        }
        if (currency === "TRY") {
            return i18n.t('currency_try')

        }
        if (currency === "AED") {
            return i18n.t('currency_aed')

        }
    }

    getUserRoleTypeNameLang = (roleType) => {

        if (roleType === 'ADMIN') {
            return i18n.t('user_admin_role_name')
        }
        else if (roleType === 'MEDIATOR') {
            return i18n.t('user_mediator_role_name')

        }
        else if (roleType === "BROKER") {
            return i18n.t('user_broker_role_name')

        }
        else if (roleType === "CLIENT") {
            return i18n.t('user_client_role_name')

        }
    }

    getFeeTypeNameLang = (feeType) => {
        if (feeType === 'PERCENTAGE') {
            return i18n.t('transfer_fee_type_percentage')
        }
        else if (feeType === 'VALUE') {
            return i18n.t('transfer_fee_type_value')
        }
    }


}

export default new HelperUtil();