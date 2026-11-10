import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  requires: ["\\bbreak\\b", "Math\\.random"],
  aggregate: "one-winning-number",
  cases: [
    {
      randoms: [0.01],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    },
    {
      randoms: [0.11000000000000001],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    },
    {
      randoms: [0.21000000000000002],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    },
    {
      randoms: [0.31],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    },
    {
      randoms: [0.41],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    },
    {
      randoms: [0.51],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    },
    {
      randoms: [0.61],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    },
    {
      randoms: [0.71],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    },
    {
      randoms: [0.8099999999999999],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    },
    {
      randoms: [0.9099999999999999],
      check(h) {
        const won=h.alerts.some(t=>/当た|当たり|正解|hit/i.test(t)); h.assert(won?h.logs.length===1:h.logs.length===10,'当たりで終了し、外れは10回試してください。');h.assert(won||h.alerts.some(t=>/ハズレ|はずれ|外れ/i.test(t)),'10回で当たらなかった場合はハズレを表示してください。');
      }
    }
  ]
};

export default grader;
