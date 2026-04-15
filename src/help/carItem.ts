import { formatAmount } from "@/utils/num"
import { fullUrl } from "@/utils/utils"
import dayjs from "dayjs"

export const handleCarItemData = (car) => {
  car.suggestedPriceStr = ((car?.suggestedPrice || 0) / 10000).toFixed(2) + '万'
  car.firstBoardTimeStr = dayjs(car.firstBoardTime).format('YYYY-MM-DD')
  car.mainMinImg = fullUrl(car.mainMinImg)
  car.dailyRentalPriceStr = formatAmount(car?.dailyRentalPrice || 0)
  return car
}
