using System;
using System.Collections;

namespace Viktor.AddIn.FileGenerator
{
	internal class FileGenerationResultCollection : CollectionBase
	{
		public FileGenerationResultCollection() : base() {}

		public void Add(FileGenerationResultCollection value)
		{
			foreach(FileGenerationResult error in value)
			{
				this.List.Add(error);
			}
		}

		public int Add(FileGenerationResult value)  
		{
			return(this.List.Add(value));
		}

		public int IndexOf(FileGenerationResult value)  
		{
			return(this.List.IndexOf(value));
		}

		public void Insert(int index, FileGenerationResult value)  
		{
			this.List.Insert(index, value);
		}

		public void Remove(FileGenerationResult value)  
		{
			this.List.Remove(value);
		}

        public FileGenerationResult this[int index]  
        {
            get  
            {
                return((FileGenerationResult)this.List[index]);
            }
            set  
            {
                this.List[index] = value;
            }
        }
	}
}
