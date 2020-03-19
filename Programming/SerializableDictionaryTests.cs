using System.IO;
using System.Xml;
using Shared.Collections;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests
{
	/// <summary>
	/// Summary description for SerializableDictionaryTest
	/// </summary>
	[TestClass]
	public class SerializableDictionaryTests
	{
		[TestMethod]
		public void AddRangeTest()
		{
			SerializableDictionary<string, string> dict1 = new SerializableDictionary<string, string>();
			dict1.Add("Dict1Key1", "Dict1Value1");
			dict1.Add("Dict1Key2", "Dict1Value2");

			SerializableDictionary<string, string> dict2 = new SerializableDictionary<string, string>();
			dict2.Add("Dict2Key1", "Dict2Value1");
			dict2.Add("Dict1Key1", "Dict2Value1");

			dict1.AddRange(dict2);

			//Verify that the dictionary only has 3 entries since the second dictionary should
			//overwrite the value that was inserted originally into dict1
			Assert.AreEqual(dict1.Keys.Count, 3);
			//Verify that the value was overwritten
			Assert.AreEqual(dict1["Dict1Key1"], "Dict2Value1");
		}

		[TestMethod]
		public void ReadWriteTest()
		{
			SerializableDictionary<string, string> dict1 = new SerializableDictionary<string, string>();
			dict1.Add("Dict1Key1", "Dict1Value1");
			dict1.Add("Dict1Key2", "Dict1Value2");
			dict1.Add("Dict1Key3", "Dict1Value3");
			dict1.Add("Dict1Key4", "Dict1Value4");

			MemoryStream ms = new MemoryStream();
			XmlWriter writer = XmlWriter.Create(ms);
			writer.WriteStartElement("root", string.Empty);
			dict1.WriteXml(writer);
			writer.WriteEndElement();
			writer.Flush();

			SerializableDictionary<string, string> dict2 = new SerializableDictionary<string, string>();

			ms.Position = 0;

			XmlReader reader = XmlReader.Create(ms);
			dict2.ReadXml(reader);

			Assert.AreEqual(dict2["Dict1Key1"], "Dict1Value1");
			Assert.AreEqual(dict2["Dict1Key2"], "Dict1Value2");
			Assert.AreEqual(dict2["Dict1Key3"], "Dict1Value3");
			Assert.AreEqual(dict2["Dict1Key4"], "Dict1Value4");

		}

		[TestMethod]
		public void GetSchemaTest()
		{
			SerializableDictionary<string, string> dict1 = new SerializableDictionary<string, string>();
			Assert.IsNull(dict1.GetSchema());
		}
	}
}