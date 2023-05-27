import axios from 'axios'
import Moment, { format } from 'moment';
import i18n from '../I18N';



class TransferFeeHelperUtil {

  getTransferFeeInWrittenPatternLan = (feeDelm, rangeValue, rangeValueMin, rangeValueMax) => {
    let pattern = i18n.t('transfer_fee_transferred_value') + ' ';
    if (feeDelm === "BETWEEN") {
      pattern += i18n.t('transfer_fee_between') + ' ' + rangeValueMin + ", " + rangeValueMax;
    }
    else if (feeDelm === "EQUAL") {
      pattern += i18n.t('transfer_fee_equal') + ' ' + rangeValue;

    }
    else if (feeDelm === "GREATER") {
      pattern += i18n.t('transfer_fee_greater') + ' ' + rangeValue;

    }

    else if (feeDelm === "LESS") {
      pattern += i18n.t('transfer_fee_less') + ' ' + rangeValue;

    }
    return pattern;
  }


}

export default new TransferFeeHelperUtil();