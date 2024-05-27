type Rule = {
    type: string
};

type Rules = {
    [key: string]: Rule;
};

export function parseData(data: any, rules: Rules): any {
    function parseValue(value: any, rule: Rule): any {
        switch (rule.type) {
            case 'int':
                return parseInt(value);
            case 'float':
                return parseFloat(value);
            case 'boolean':
                return value === 'true' || value === '1';
            case 'string':
                return String(value);
            case 'date':
                return new Date(value)
            case 'object':
                return value; // For objects, we'll rely on recursion
            default:
                return value; // If no rule matches, return the value as is
        }
    };

    function parseObject(dataObj: any, rulesObj: Rules, rule?: Rule | undefined): any {
        const result: any = {};
        for (const key in dataObj) {
            const value = dataObj[key];
            const ruleObj = rule || rulesObj[key];
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // If the value is an object and there's a corresponding rule, recurse
                result[key] = parseObject(value, rules, ruleObj);
            } else if (ruleObj && typeof ruleObj === 'object' && 'type' in ruleObj) {
                // If a rule is defined for this key, apply the conversion
                result[key] = parseValue(value, ruleObj as Rule);
            } else {
                // If no rule is defined, keep the original value
                result[key] = value;
            }
        }
        return result;
    };

    return parseObject(data, rules);
}