import { describe, expect, it } from 'vitest'
import recordsCardUtils from "@/utils/recordsCardUtils.js";

describe("recordsCardUtils.js", function(){

  it("capitalises initial letter of a string", function () {
    let record_one = {
      name: 'a name',
      id: 1
    }
    let record_two = {
      name: 'another name',
      id: 2,
      doi: 'some_numbers/a_string'
    }
    expect(recordsCardUtils.methods.getRecordLink(record_one)).toEqual(1);
    expect(recordsCardUtils.methods.getRecordLink(record_two)).toEqual('a_string');
  });
});