/**
 * https://leetcode.cn/problems/two-sum/submissions/564604413/?envType=study-plan-v2&envId=top-100-liked
 */


/**
 * 暴力法
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum_2 = function(nums, target) {
  let len = nums.length
  for(let i = 0; i< len -1 ; i++) {
    let current = nums.splice(0, 1)[0]
    const lastIndex = nums.indexOf(target - current)
    if(lastIndex > -1) {
      return [i, lastIndex+i+1]
    }
  }
};


/**
 * 哈希表的方法
 * 时间复杂度：O(N)
 * 空间复杂度：O(N)
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum_3 = function(nums, target) {
  let len = nums.length
  let hashList = []
  hashList.push(nums[0])
  for(let i = 1; i < len; i++) {
    const current = nums[i]
    const firstIndex = hashList.indexOf(target - current)
    if(firstIndex > -1) {
      return [firstIndex, i]
    }
    hashList.push(current)
  }
};

console.log(twoSum_2([1,6142,8192,10239], 18431))
console.log(twoSum_3([1,6142,8192,10239], 18431))