import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Activity } from "@/types/activity-types/activityTypes";
import { DefaultPricingDto } from "@/types/defaultPricingType/defaultPricingTypes";
import { Measure } from "@/types/measure-types/measureTypes";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

type UserWorkitemContextType = {
  artisanId: string | undefined;
  defaultPricings: DefaultPricingDto[] | [];
  dispatch: React.Dispatch<any>;
  activities: Activity[];
  measure: Measure | null;
  defaultPricingId: string;
  activityId: string;
  taskId: string;
};
const initialState = {
  artisanId: "",
  activityId: "",
  measure: null,
  defaultPricings: [],
  activities: [],
  defaultPricingId: "",
  taskId: ""
};
function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_ARTISAN_ID":
      return { ...state, artisanId: action.payload };
    case "SET_ACTIVITY_MEASURE_ID":
      console.log(action.payload);
      return { ...state, activityId: action.payload, measure: state.defaultPricings.find(dp => dp.activity.id === action.payload)?.measure };
    case "SET_MEASURE_ID":
      return { ...state, measureId: action.payload };
    case "SET_ACTIVITIES":
      return { ...state, activities: action.payload };
    case "SET_DEFAULT_PRICINGS_ACTIVITY":
      return { ...state, defaultPricings: action.payload.defaultPricings, activities: action.payload.activities };
    case "RESET_MEASURE":
      return { ...state, measure: null };
    case "SET_DEFAULT_PRICING_ID":
      return { ...state, defaultPricingId: action.payload };
    case "SET_TASK_ID":
      return { ...state, projectId: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
const UserWorkitemContext = createContext<UserWorkitemContextType | undefined>(undefined);
export const UserWorkitemProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ activities, measure, activityId, defaultPricingId, defaultPricings, taskId }, dispatch] = useReducer(reducer, initialState);
  // Get artisanId from user token
  const { data } = useFetchDataQuery<{ id: string }>({
    URL: "/artisanId",
    queryKey: ["artisanId"],
    options: {
      staleTime: Infinity
    }
  });

  const artisanId = data?.id;
  // Get default pricings for user
  const { data: defaultPricingsResponse } = useFetchDataQuery<{ defaultPricing: DefaultPricingDto[] }>({
    URL: artisanId && taskId ? `/default-pricing/get-by-project/${artisanId}/${taskId}` : "",
    queryKey: ["default-pricing", artisanId, taskId]
  });

  const defaultPricingsData = useMemo(() => {
    return defaultPricingsResponse?.defaultPricing || [];
  }, [defaultPricingsResponse]);

  useEffect(() => {
    if (defaultPricingsData.length > 0) {
      const transformPricingData = (data: DefaultPricingDto[]) => {
        const activities = data.map(item => item.activity).filter((value, index, self) => self.findIndex(t => t.id === value.id) === index);

        dispatch({ type: "SET_DEFAULT_PRICINGS_ACTIVITY", payload: { defaultPricings: data, activities: activities } });
      };
      transformPricingData(defaultPricingsData);
    }
  }, [defaultPricingsData]);
  useEffect(() => {
    if (!activityId || !measure) return;
    const defaultPricing = defaultPricings.find(dp => dp.activity.id === activityId && dp.measure.id === measure.id);
    if (defaultPricing) dispatch({ type: "SET_DEFAULT_PRICING_ID", payload: defaultPricing.id });
  }, [activityId, measure, defaultPricings]);

  return <UserWorkitemContext.Provider value={{ activities, artisanId, defaultPricings, dispatch, measure, activityId, defaultPricingId, taskId }}>{children}</UserWorkitemContext.Provider>;
};
export const useUserWorkitem = () => {
  const context = useContext(UserWorkitemContext);
  if (context === undefined) {
    throw new Error("useUserWorkitem must be used within a UserWorkitemProvider");
  }
  return context;
};
